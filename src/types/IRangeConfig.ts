import { KafkaConfig } from 'kafkajs';

export interface IRangeConfig {
  kafka: Pick<KafkaConfig, 'clientId' | 'brokers' | 'ssl' | 'sasl'>;
  kafkaTopics: {
    blockRuleGroupTasks: string;
    errorsBlockRuleTasks: string;
    tickRuleGroupTasks: string;
  };
  kafkaGroupIds: {
    blockRuleGroupTasks: string;
    errorsBlockRuleTasks: string;
    tickRuleGroupTasks: string;
  };
}
