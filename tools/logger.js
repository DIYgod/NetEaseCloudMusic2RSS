var log4js = require('log4js');
log4js.configure({
    appenders: {
        NetEaseCloudMusic2RSS: {
            type: 'file',
            filename: 'logs/NetEaseCloudMusic2RSS.log',
            maxLogSize: 20480,
            backups: 3,
            compress: true
        },
        console: {
            type: 'console'
        }
    },
    categories: { default: { appenders: ['NetEaseCloudMusic2RSS', 'console'], level: 'INFO' } }
});
var logger = log4js.getLogger('NetEaseCloudMusic2RSS');

module.exports = logger;