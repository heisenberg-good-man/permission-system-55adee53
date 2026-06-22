const express = require('express');
const router = express.Router();
const data = require('../data/mockData');

function formatDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

router.get('/', (req, res) => {
  const { keyword, city, status } = req.query;
  let result = [...data.jobs];

  if (keyword) {
    result = result.filter(job =>
      job.title.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  if (city) {
    result = result.filter(job => job.city === city);
  }
  if (status) {
    result = result.filter(job => job.status === status);
  }

  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(result);
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const job = data.jobs.find(j => j.id === id);

  if (!job) {
    return res.status(404).json({ error: '职位不存在' });
  }

  job.views = (job.views || 0) + 1;
  res.json(job);
});

router.post('/', (req, res) => {
  const { title, company, city, salary, experience, education, description, requirements, benefits } = req.body;

  if (!title || !company || !city || !salary) {
    return res.status(400).json({ error: '请填写必填项' });
  }

  const newJob = {
    id: data.nextJobId++,
    title,
    company,
    city,
    salary,
    experience: experience || '不限',
    education: education || '不限',
    status: 'open',
    description: description || '',
    requirements: requirements || '',
    benefits: benefits || '',
    createdAt: formatDate(),
    views: 0
  };

  data.jobs.unshift(newJob);
  res.status(201).json(newJob);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const jobIndex = data.jobs.findIndex(j => j.id === id);

  if (jobIndex === -1) {
    return res.status(404).json({ error: '职位不存在' });
  }

  const { title, company, city, salary, experience, education, status, description, requirements, benefits } = req.body;

  if (!title || !company || !city || !salary) {
    return res.status(400).json({ error: '请填写必填项' });
  }

  data.jobs[jobIndex] = {
    ...data.jobs[jobIndex],
    title,
    company,
    city,
    salary,
    experience: experience || '不限',
    education: education || '不限',
    status: status || data.jobs[jobIndex].status,
    description: description || '',
    requirements: requirements || '',
    benefits: benefits || ''
  };

  res.json(data.jobs[jobIndex]);
});

router.patch('/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const job = data.jobs.find(j => j.id === id);

  if (!job) {
    return res.status(404).json({ error: '职位不存在' });
  }

  const { status } = req.body;
  if (!['open', 'closed'].includes(status)) {
    return res.status(400).json({ error: '无效的状态' });
  }

  job.status = status;
  res.json(job);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const jobIndex = data.jobs.findIndex(j => j.id === id);

  if (jobIndex === -1) {
    return res.status(404).json({ error: '职位不存在' });
  }

  data.jobs.splice(jobIndex, 1);
  res.json({ success: true });
});

router.get('/stats/summary', (req, res) => {
  const totalJobs = data.jobs.length;
  const openJobs = data.jobs.filter(j => j.status === 'open').length;
  const totalApplications = data.applications.length;
  const pendingApplications = data.applications.filter(a => a.status === 'pending').length;

  res.json({
    totalJobs,
    openJobs,
    totalApplications,
    pendingApplications
  });
});

module.exports = router;
