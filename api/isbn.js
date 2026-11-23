module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { isbn } = req.query;
  if (!isbn) {
    return res.status(400).json({ error: "缺少isbn参数" });
  }

  const appid = process.env.SHOWAPI_APPID;
  const sign = process.env.SHOWAPI_SIGN;

  if (!appid || !sign) {
    return res.status(500).json({ error: "后台密钥未配置" });
  }

  const targetUrl = `https://route.showapi.com/1626-1?showapi_appid=${appid}&showapi_sign=${sign}&isbn=${isbn}`;

  try {
    const fetchRes = await fetch(targetUrl);
    const data = await fetchRes.json();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "请求ShowAPI失败", detail: err.message });
  }
};
