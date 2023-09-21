import { Kafka, KafkaConfig, SASLOptions } from 'kafkajs';
import { env } from '../env';
import { readFileSync } from 'fs';

export function getKafkaClient(runnerID: string) {
  const brokers: string[] = env.KAFKA.HOSTS.split(',');
  const kafkaConfig: KafkaConfig = {
    clientId: `rangeSDK-runner-${runnerID}`,
    brokers,
  };

  if (env.KAFKA.SECURE) {
    if (
      !env.KAFKA.SSL ||
      !env.KAFKA.SSL.CA_FILE ||
      !env.KAFKA.SSL.KEY_FILE ||
      !env.KAFKA.SSL.CERT_FILE ||
      !env.KAFKA.SASL ||
      !env.KAFKA.SASL.USERNAME ||
      !env.KAFKA.SASL.PASSWORD
    ) {
      console.error(
        `When KAFKA_SECURE is enable you need to provide the following env variables for SSL and SASL`,
      );
      throw new Error(
        'When KAFKA_SECURE is enable you need to provide the following env variables for SSL and SASL`',
      );
    }

    kafkaConfig.ssl = {
      rejectUnauthorized: false, // If you don't have CA to validate the certificate, otherwise you should set this to true
      ca: [readFileSync(env.KAFKA.SSL.CA_FILE, 'utf-8')],
      key: readFileSync(env.KAFKA.SSL.KEY_FILE, 'utf-8'),
      cert: readFileSync(env.KAFKA.SSL.CERT_FILE, 'utf-8'),
    };
    kafkaConfig.sasl = {
      mechanism: 'plain',
      username: env.KAFKA.SASL.USERNAME,
      password: env.KAFKA.SASL.PASSWORD,
    };
  }

  return new Kafka(kafkaConfig);
}
