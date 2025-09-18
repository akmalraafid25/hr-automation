import snowflake, { Connection } from "snowflake-sdk";

let connectionPool: Connection[] = [];
const MAX_CONNECTIONS = 5;

export function connect(): Promise<Connection> {
  // Reuse existing connection if available
  if (connectionPool.length > 0) {
    return Promise.resolve(connectionPool.pop()!);
  }

  let sfKey = process.env.SNOWFLAKE_PRIVATE_KEY;
  if (sfKey) {
    sfKey = sfKey.replace(/\\n/g, "\n");
  }

  const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT!,
    username: process.env.SNOWFLAKE_USER!,
    privateKey: sfKey,
    authenticator: "SNOWFLAKE_JWT",
    privateKeyPass: process.env.SNOWFLAKE_PRIVATE_KEY_PASSPHRASE,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    role: process.env.SNOWFLAKE_ROLE,
    clientSessionKeepAlive: true,
    clientSessionKeepAliveHeartbeatFrequency: 3600
  });

  return new Promise((resolve, reject) => {
    connection.connect((err, conn) => {
      if (err) {
        console.error("Unable to connect to Snowflake:", err.message);
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
}

export function releaseConnection(connection: Connection) {
  if (connectionPool.length < MAX_CONNECTIONS) {
    connectionPool.push(connection);
  } else {
    connection.destroy();
  }
}