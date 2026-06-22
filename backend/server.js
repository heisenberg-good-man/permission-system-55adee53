const express = require('express');
const cors = require('cors');
const path = require('path');

const jobsRouter = require('./routes/jobs');
const applicationsRouter = require('./routes/applications');
const messagesRouter = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '招聘平台后端服务运行正常' });
});

app.use('/api/jobs', jobsRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/messages', messagesRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`招聘平台后端服务已启动: http://localhost:${PORT}`);
  console.log(`API 健康检查: http://localhost:${PORT}/api/health`);
});

module.exports = app;
