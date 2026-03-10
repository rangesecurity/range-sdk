import 'reflect-metadata';
import { ValidateParameters } from '../utils/validateParameters';
import { BlockProcessor, IBlockProcessor } from '../utils/processor';
import { ISubEvent } from '../types/IEvent';

describe('ValidateParameters decorator', () => {
  it('throws when rule is missing from args', () => {
    class TestProcessor extends BlockProcessor {
      @ValidateParameters()
      async callback(ctx: IBlockProcessor): Promise<ISubEvent[]> {
        return [];
      }
    }
    // Attach rule metadata (simulating @Rule decorator)
    (TestProcessor.prototype as any).__rule = {
      type: 'test',
      parameters: [],
    };

    const proc = new TestProcessor();
    expect(() => proc.callback({} as any)).toThrow('Rule is required');
  });

  it('injects validated params into context', async () => {
    let capturedParams: any;
    class TestProcessor extends BlockProcessor {
      @ValidateParameters()
      async callback(ctx: IBlockProcessor): Promise<ISubEvent[]> {
        capturedParams = (ctx as any).params;
        return [];
      }
    }
    (TestProcessor.prototype as any).__rule = {
      type: 'test',
      parameters: [
        { field: 'threshold', fieldType: 'Number', optional: false },
      ],
    };

    const proc = new TestProcessor();
    await proc.callback({
      rule: { parameters: { threshold: 10 } },
      block: {},
    } as any);

    expect(capturedParams).toEqual({ threshold: 10 });
  });

  it('throws for missing required field', () => {
    class TestProcessor extends BlockProcessor {
      @ValidateParameters()
      async callback(ctx: IBlockProcessor): Promise<ISubEvent[]> {
        return [];
      }
    }
    (TestProcessor.prototype as any).__rule = {
      type: 'test',
      parameters: [
        { field: 'required_field', fieldType: 'Text', optional: false },
      ],
    };

    const proc = new TestProcessor();
    expect(() =>
      proc.callback({
        rule: { parameters: {} },
        block: {},
      } as any)
    ).toThrow('Missing required field required_field');
  });

  it('skips optional undefined fields', async () => {
    let capturedParams: any;
    class TestProcessor extends BlockProcessor {
      @ValidateParameters()
      async callback(ctx: IBlockProcessor): Promise<ISubEvent[]> {
        capturedParams = (ctx as any).params;
        return [];
      }
    }
    (TestProcessor.prototype as any).__rule = {
      type: 'test',
      parameters: [
        { field: 'opt', fieldType: 'Text', optional: true },
        { field: 'req', fieldType: 'Text', optional: false },
      ],
    };

    const proc = new TestProcessor();
    await proc.callback({
      rule: { parameters: { req: 'hello' } },
      block: {},
    } as any);

    expect(capturedParams).toEqual({ req: 'hello' });
    expect(capturedParams.opt).toBeUndefined();
  });
});
