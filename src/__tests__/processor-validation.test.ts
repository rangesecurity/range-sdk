import 'reflect-metadata';
import {
  BlockProcessor,
  TickProcessor,
  ProcessorRegistry,
  IBlockProcessor,
  ITickProcessor,
} from '../utils/processor';
import { ISubEvent } from '../types/IEvent';

beforeEach(() => {
  (ProcessorRegistry as any).processorMap = new Map();
});

class ValidBlockProcessor extends BlockProcessor {
  async callback({ rule, block }: IBlockProcessor): Promise<ISubEvent[]> {
    return [];
  }
}

describe('ProcessorRegistry validation', () => {
  it('throws on empty rule type', () => {
    expect(() =>
      ProcessorRegistry.register(
        {
          type: '',
          label: 'Bad',
          description: '',
          parameters: [],
          networks: ['eth'],
          tags: ['security'],
        },
        ValidBlockProcessor
      )
    ).toThrow('rule.type must be a non-empty string');
  });

  it('throws on whitespace-only rule type', () => {
    expect(() =>
      ProcessorRegistry.register(
        {
          type: '   ',
          label: 'Bad',
          description: '',
          parameters: [],
          networks: ['eth'],
          tags: ['security'],
        },
        ValidBlockProcessor
      )
    ).toThrow('rule.type must be a non-empty string');
  });

  it('throws on duplicate rule type', () => {
    ProcessorRegistry.register(
      {
        type: 'my-rule',
        label: 'First',
        description: '',
        parameters: [],
        networks: ['eth'],
        tags: ['security'],
      },
      ValidBlockProcessor
    );
    expect(() =>
      ProcessorRegistry.register(
        {
          type: 'my-rule',
          label: 'Second',
          description: '',
          parameters: [],
          networks: ['eth'],
          tags: ['security'],
        },
        ValidBlockProcessor
      )
    ).toThrow('duplicate rule type "my-rule"');
  });

  it('throws when class lacks callback or taskType', () => {
    class BadProcessor {}
    expect(() =>
      ProcessorRegistry.register(
        {
          type: 'bad',
          label: 'Bad',
          description: '',
          parameters: [],
          networks: ['eth'],
          tags: ['security'],
        },
        BadProcessor as any
      )
    ).toThrow('must extend BlockProcessor or TickProcessor');
  });

  it('warns on duplicate parameter fields', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    ProcessorRegistry.register(
      {
        type: 'dup-params',
        label: 'Dup Params',
        description: '',
        parameters: [
          {
            field: 'addr',
            label: 'Addr 1',
            fieldType: 'Address',
            description: '',
          },
          {
            field: 'addr',
            label: 'Addr 2',
            fieldType: 'Address',
            description: '',
          },
        ],
        networks: ['eth'],
        tags: ['security'],
      },
      ValidBlockProcessor
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('duplicate parameter fields: addr')
    );
    warnSpy.mockRestore();
  });

  it('allows valid registration without warnings', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    ProcessorRegistry.register(
      {
        type: 'valid-rule',
        label: 'Valid',
        description: '',
        parameters: [
          { field: 'a', label: 'A', fieldType: 'Number', description: '' },
          { field: 'b', label: 'B', fieldType: 'Text', description: '' },
        ],
        networks: ['eth'],
        tags: ['security'],
      },
      ValidBlockProcessor
    );
    expect(warnSpy).not.toHaveBeenCalled();
    expect(ProcessorRegistry.get('valid-rule')).toBeDefined();
    warnSpy.mockRestore();
  });
});
