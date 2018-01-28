var logger = require('../tools/logger');
var request = require('request');

module.exports = function (req, res) {
    res.header('Content-Type', 'application/xml; charset=utf-8');

    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var name;

    var id = req.params.id;

    logger.info(`NetEaseCloudMusic2RSS id ${id}, IP: ${ip}`);
    request.post({
        url: 'http://music.163.com/api/v3/playlist/detail',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36',
            'Referer': `http://music.163.com/`,
            'Origin': 'http://music.163.com'
        },
        form: {
            id: id
        }
    }, function (err, httpResponse, body) {
        const data = JSON.parse(body);
        if (data && data.playlist) {
            const list = data.playlist && data.playlist.tracks || [];
            var rss =
                `<?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
            <channel>
            <title>${data.playlist.name}</title>
            <link>http://music.163.com/#/playlist?id=${id}</link>
            <description>网易云音乐歌单 - ${data.playlist.name}，使用 NetEaseCloudMusic2RSS(https://github.com/DIYgod/NetEaseCloudMusic2RSS) 构建</description>
            <language>zh-cn</language>
            <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
            <ttl>300</ttl>`
                for (var i = 0; i < list.length; i++) {
                    const singer = list[i].ar.length === 1 ? list[i].ar[0].name : list[i].ar.reduce((prev, cur, index, array) => (prev.name || prev) + '/' + cur.name);
                    rss += `
            <item>
                <title><![CDATA[${list[i].name} - ${singer}]]></title>
                <description><![CDATA[歌手：${singer}<br>专辑：${list[i].al.name}<br>日期：${new Date(list[i].publishTime).toLocaleDateString()}<br><img referrerpolicy="no-referrer" src="${list[i].al.picUrl}">]]></description>
                <guid>http://music.163.com/#/song?id=${list[i].id}</guid>
                <link>hhttp://music.163.com/#/song?id=${list[i].id}</link>
            </item>`
            }
            rss += `
            </channel>
            </rss>`
            res.send(rss);
        }
    });
};