module.exports = {

    localhost: '127.0.0.1',

    mySQLConfig: {
        host: "db.cs.dal.ca",
        port: 3306,
        user: "ktulloch",
        password: "9nT3ktQxoxRqBrCaVsvF6XXsc",
        database: "ktulloch",
      },
    
    sshTunnelConfig: {
        host: "timberlea.cs.dal.ca",
        port: 3306,
        username: "KTulloch",
        password: process.env.dbPassword
    }
};

