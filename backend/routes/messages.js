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

router.get('/application/:applicationId', (req, res) => {
  const applicationId = parseInt(req.params.applicationId);
  const messages = data.messages.filter(m => m.applicationId === applicationId);
  messages.sort((a, b) => new Date(a.time) - new Date(b.time));
  res.json(messages);
});

router.post('/', (req, res) => {
  const { applicationId, sender, content } = req.body;

  if (!applicationId || !sender || !content) {
    return res.status(400).json({ error: '请填写所有必填项' });
  }

  const application = data.applications.find(a => a.id === parseInt(applicationId));
  if (!application) {
    return res.status(404).json({ error: '投递记录不存在' });
  }

  if (!['recruiter', 'applicant'].includes(sender)) {
    return res.status(400).json({ error: '无效的发送者身份' });
  }

  const newMessage = {
    id: data.nextMessageId++,
    applicationId: parseInt(applicationId),
    sender,
    content,
    time: formatDateTime()
  };

  data.messages.push(newMessage);
  res.status(201).json(newMessage);
});

module.exports = router;
