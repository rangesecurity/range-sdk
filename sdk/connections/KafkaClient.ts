import { Kafka, Consumer, SASLOptions } from 'kafkajs';
import * as tls from 'node:tls'
import { readFileSync } from 'node:fs';
import { env } from '../env';
import { IRangeNetwork } from '../types/IRangeNetwork';

interface KafkaSecure {
    ssl: tls.ConnectionOptions,
    sasl: SASLOptions
}

const logger = console; // update this in future

export abstract class KafkaClient<T> {
    private kafka: Kafka;
    private consumer: Consumer;

    constructor(private topics: string[]) {
        // Parse the comma-separated list of Kafka brokers from environment variable
        const brokers: string[] = env.KAFKA.HOSTS.split(",")

        // Create a new Kafka instance and connect to the specified brokers
        logger.debug(`Connecting Kafka brokers: ${brokers}`)
        this.kafka = new Kafka({
            clientId: `block-fetcher`,
            // Provide the list of brokers to connect to string[]
            brokers,
            // If Kafka is configured to use SSL/TLS, provide secure configuration options
            ...(env.KAFKA.SECURE ? this.getSecureKafkaConfig() : {})
        });

        // Create a new consumer instance for this Kafka connection
        this.consumer = this.kafka.consumer({ groupId: `processor-node` })
    }

    public async init() {
        // Connect the consumer to Kafka brokers
        await this.consumer.connect();

        // Subscribe the consumer to the specified topic and start consuming from the beginning
        await this.consumer.subscribe({ topics: this.topics, fromBeginning: true })


        // Start consuming messages from the subscribed topic
        await this.consumer.run({
            eachMessage: async ({ message }) => {
                // Convert the raw message value (buffer) to a string
                const rawMessage = message?.value?.toString()

                // Check if the message was successfully converted to a string
                if (!rawMessage) {
                    logger.error(`Error decoding incoming raw message: ${rawMessage}`)
                    return
                }

                //  Parse the message from the string to the expected type T
                const parseMessage: T = JSON.parse(rawMessage)

                // Process the parsed message using the processMessage function - you need to implement this function when extending
                this.processMessage(parseMessage)
            },
        })

        logger.info(`Blocks kafka consumer has started for topics: ${this.topics}`)
    }

    protected abstract processMessage(message: T): void

    public async close() {
        await this.consumer.disconnect();
    }

    private getSecureKafkaConfig(): KafkaSecure {
        if (!env.KAFKA.SSL
            || !env.KAFKA.SSL.CA_FILE
            || !env.KAFKA.SSL.KEY_FILE
            || !env.KAFKA.SSL.CERT_FILE
            || !env.KAFKA.SASL
            || !env.KAFKA.SASL.USERNAME
            || !env.KAFKA.SASL.PASSWORD
        ) {
            logger.error(`When KAFKA_SECURE is enable you need to provide the following env variables for SSL and SASL`)
            process.exit(1)
        }


        return {
            ssl: {
                rejectUnauthorized: false, // If you don't have CA to validate the certificate, otherwise you should set this to true
                ca: [readFileSync(env.KAFKA.SSL.CA_FILE, 'utf-8')],
                key: readFileSync(env.KAFKA.SSL.KEY_FILE, 'utf-8'),
                cert: readFileSync(env.KAFKA.SSL.CERT_FILE, 'utf-8'),
            },
            sasl: {
                mechanism: 'plain',
                username: env.KAFKA.SASL.USERNAME,
                password: env.KAFKA.SASL.PASSWORD,
            },
        }
    }
}