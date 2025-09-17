import snowflake, { Connection } from "snowflake-sdk";

export function connect(): Promise<Connection> {
  let sfKey = process.env.SNOWFLAKE_PRIVATE_KEY;
  // This replace function is a failsafe to prevent .env formatting issues
  if (sfKey) {
    sfKey = sfKey.replace(/\\n/g, "\n");
  }

  const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT!,
    username: process.env.SNOWFLAKE_USER!,
    privateKey: sfKey,
    authenticator: "SNOWFLAKE_JWT", // Your excellent fix!
    privateKeyPass: process.env.SNOWFLAKE_PRIVATE_KEY_PASSPHRASE,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    role: process.env.SNOWFLAKE_ROLE,
  });

  // Wrap the connection in a Promise
  return new Promise((resolve, reject) => {
    connection.connect((err, conn) => {
      if (err) {
        console.error("Unable to connect to Snowflake:", err.message);
        reject(err);
      } else {
        console.log("Successfully connected to Snowflake.");
        resolve(conn);
      }
    });
  });
}