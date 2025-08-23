export default () => {
  const env = process.env;

  return {
    AUTH_SERVICE: {
      HOST: env.AUTH_SERVICE_HOST || 'localhost',
      PORT: parseInt(env.AUTH_SERVICE_PORT || '6001', 10),
    },

    MONGO_URI: env.MONGO_URI!,

    REDIS: {
      HOST: env.REDIS_HOST || 'localhost',
      PORT: parseInt(env.REDIS_PORT || '6379', 10),
      PASSWORD: env.REDIS_PASSWORD,
    },

    RABBITMQ: {
      HOST: env.RABBITMQ_HOST,
      PORT: parseInt(env.RABBITMQ_PORT!, 10),
      USERNAME: env.RABBITMQ_USERNAME,
      PASSWORD: env.RABBITMQ_PASSWORD,
      VHOST: env.RABBITMQ_VHOST,
    },

    OTP: {
      LENGTH: parseInt(env.OTP_LENGTH || '6', 10),
      TTL: parseInt(env.OTP_TTL || '600', 10),
      MAX_ATTEMPTS: parseInt(env.OTP_MAX_ATTEMPTS || '3', 10),
    },

    JWT: {
      SECRET: env.JWT_SECRET,
    },

    ACCESS_TOKEN: {
      SECRET: env.ACCESS_TOKEN_SECRET || 'default-access-secret',
      TTL: env.ACCESS_TOKEN_TTL || '1h',
    },

    REFRESH_TOKEN: {
      SECRET: env.REFRESH_TOKEN_SECRET || 'default-refresh-secret',
      DEFAULT_TTL: env.REFRESH_TOKEN_DEFAULT_TTL || '1d',
      REMEMBER_ME_TTL: env.REFRESH_TOKEN_REMEMBER_ME_TTL || '30d',
    },

    MAIL_PROVIDER: env.MAIL_PROVIDER,

    SENDGRID: {
      API_KEY: env.SENDGRID_API_KEY!,
      FROM_EMAIL: env.SENDGRID_FROM_EMAIL || 'no-reply@example.com',
      FROM_NAME: env.SENDGRID_FROM_NAME || 'App',
    },
  };
};
