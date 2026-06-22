const express = require('express');
const router = express.Router();
const data = require('../data/mockData');

function formatDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

router.get('/', (req, res) => {
  const { jobId, status } = req.query;
  let result = [...data.applications];

  if (jobId) {
    result = result.filter(a => a.jobId === parseInt(jobId));
  }
  if (status) {
    result = result.filter(a => a.status === status);
  }

  result.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  res.json(result);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const application = data.applications.find(a => a.id === id);

  if (!application) {
    return res.status(404).json({ error: '投递记录不存在' });
  }

  res.json(application);
});

router.post('/', (req, res) => {
  const { jobId, applicantName, email, phone, experience, education, resume } = req.body;

  if (!jobId || !applicantName || !email || !phone || !resume) {
    return res.status(400).json({ error: '请填写所有必填项' });
  }

  const job = data.jobs.find(j => j.id === parseInt(jobId));
  if (!job) {
    return res.status(404).json({ error: '职位不存在' });
  }

  if (job.status === 'closed') {
    return res.status(400).json({ error: '该职位已关闭，无法投递' });
  }

  const existingApplication = data.applications.find(
    a => a.jobId === parseInt(jobId) && a.email === email
  );
  if (existingApplication) {
    return res.status(400).json({ error: '您已经投递过该职位，请勿重复投递' });
  }

  const newApplication = {
    id: data.nextApplicationId++,
    jobId: parseInt(jobId),
    jobTitle: job.title,
    applicantName,
    email,
    phone,
    experience: experience || '不限',
    education: education || '不限',
    resume,
    status: 'pending',
    appliedAt: formatDateTime()
  };

  data.applications.unshift(newApplication);
  res.status(201).json(newApplication);
});

router.patch('/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const application = data.applications.find(a => a.id === id);

  if (!application) {
    return res.status(404).json({ error: '投递记录不存在' });
  }

  const { status } = req.body;
  const validStatuses = ['pending', 'reviewing', 'interview', 'offer', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: '无效的状态' });
  }

  application.status = status;
  res.json(application);
});

module.exports = router;
