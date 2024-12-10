// awsConfigS3.js
const { S3Client } = require('@aws-sdk/client-s3'); // Importamos el cliente de AWS SDK v3

// Configuración del cliente S3
const s3 = new S3Client({
  region: 'us-east-1', // Configura correctamente la región
  credentials: {
    accessKeyId: 'ASIAY3ESGMEQFZRWTCSN', // Tu clave de acceso
        secretAccessKey: 'mUpNM8phssrKMZXLJnZjLjHC6pxqc7qE6YgmDItm', // Tu clave secreta
        sessionToken: 'IQoJb3JpZ2luX2VjEM7//////////wEaCXVzLXdlc3QtMiJHMEUCID0ULPIwjF79Z5gDs9wuLZFBNEpRksnQzAmid4iD6A+MAiEA7BMQSSFhSgrTKdHBqR2bbjF6OgWTiChkL6TmRWfH7B4qvgIIh///////////ARACGgw2MDgwNDQ0NzQ2NTYiDFIEYwB+29L/7KvboiqSAtXGoUD2OFLcume0n7qSMmRrSKm3hef+PZEK3vNuuDbiVaBoFdrWtyBjsyR3nfh4fzq/+dECx6G0/q3mSFH0j18CboX9qEJOG/dQhfM5GN/k3D9qbA0lhT22ijc8OcVV88r1MXW1BKEfSLLqAe9d3IiebS8L2jYo7Tg6iP1HSmBUWRnZ/4LeQkdIF66aANLBYFCR6ONYWtgr1gYU87YDvARyCTrxnilgsrAtajZc8BAV8Frjw9Yvrjgz8JXTIRdzks7IPbTkFI51Fre3+Bx9UEbGD7ag4JEbeiRa+lKxqi8hZrqRZ6h91GXMvM5EjreVjw/Q/Kj8k2uX+LEVh0UxFwWOpc+PC9D5t4VtUUVga2h70xMwlqvfugY6nQEo7IsLpt8H2u6fzuvXe389JvmT2WM54eLWwXntdENDrCASScscPDAndifdpfoQqQDXZU+vqbPoVHWi1imlaortFeYeFETHDCyGhXH5xsN+2Kl2PnNQQWt4TOnc+5xITVqqhFYnlEsDG2i2bfszn4nuKm2mnWCSAvv4WcZNfvdG26Bt5yQf9Tm5Zerl39kkAsj8do9k9TZSV60I3nBX', // Tu session token
    }
});

module.exports = s3;
