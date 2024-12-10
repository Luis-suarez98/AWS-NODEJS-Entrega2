// config/aws-config.js
const AWS = require('aws-sdk');

// Configuración de AWS con las credenciales temporales
AWS.config.update({
  accessKeyId: 'ASIAY3ESGMEQKUWPXA6B',           // Tu clave de acceso
  secretAccessKey: 'cBMG/FK0ixXKYWWL+wEZJXTcLkjkEHReYpDRaXIT',  // Tu clave secreta
  sessionToken: 'IQoJb3JpZ2luX2VjEML//////////wEaCXVzLXdlc3QtMiJGMEQCIDF+gSMj+Xph1819DI6c09DXA+UmaxGoWf+ovYywWMFnAiAL+aoee3RVih4jaintXMqYNn/6oKJ3EoF8QoI7Fdr8Hiq1Agh7EAIaDDYwODA0NDQ3NDY1NiIMKOnvnCqE2TZhNADRKpIC6I9ItT0ZfcBgUuojtoQY6iMAoiL3ajFmKEuQJwdMwfVLiU1icgCQGDnrDD66cME52o9iYEWldGlDiyrutgYlwsOWhDhZAGHjE9lYK6ShOdDBK6lzx/kn4KUMkIFGIe4P43imvDR1zWCPknXFayZH4oPCuNq3skkRLDDPX1IsybBJIbhe2ijFdbzC6bzD5Az+08jIpD3GRb16yb8bFM2wEldFbsMMLiSBgvwShsfX6L4C8nHfDfIl7sO7q91s6vYok4HR3iu5nNR2SCdAiAAsZ+ObxCBagUY3R/qnNHv5VwVClVy9InuY7/M12nKFjhhgw782L0WpMNiwXBJGWAaleNK319pxbu6Sw7uigOXGfuwjRjCY3ty6BjqeAWuYZmFRVjUHOWDgeIJcOeBuXioUknNdkBIpfe0Kuo+rQbyc+k5qpjSFFLlauN0IFfAJuMJeWBdOkE7JKQdHNsjpqsOAjLXLM43Xpn6RDHl+ARXGY4eyazvbx4PJ5/hkshtPxzQscPft2MJarmxqJejAXuYlPELKmjFQaghQpyIJLbPQH3OzCvgBMsvqjg3AoZF29yuJ3DX7rsghyZFz',  // Tu session token
  region: 'us-east-1'
});

module.exports = AWS;
