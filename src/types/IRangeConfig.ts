import { KafkaConfig } from 'kafkajs';

export interface IRangeConfig {
  kafka: Pick<KafkaConfig, 'clientId' | 'brokers' | 'ssl' | 'sasl'>;
  kafkaTopics: {
    blockRuleGroupTasks: string;
    errorsBlockRuleTasks: string;
  };
  kafkaGroupIds: {
    blockRuleGroupTasks: string;
    errorsBlockRuleTasks: string;
  };
}
