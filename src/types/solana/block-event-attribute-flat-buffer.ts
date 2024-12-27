// automatically generated by the FlatBuffers compiler, do not modify

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import * as flatbuffers from 'flatbuffers';

export class BlockEventAttributeFlatBuffer {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):BlockEventAttributeFlatBuffer {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsBlockEventAttributeFlatBuffer(bb:flatbuffers.ByteBuffer, obj?:BlockEventAttributeFlatBuffer):BlockEventAttributeFlatBuffer {
  return (obj || new BlockEventAttributeFlatBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsBlockEventAttributeFlatBuffer(bb:flatbuffers.ByteBuffer, obj?:BlockEventAttributeFlatBuffer):BlockEventAttributeFlatBuffer {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new BlockEventAttributeFlatBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

key():string|null
key(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
key(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

value():string|null
value(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
value(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

static startBlockEventAttributeFlatBuffer(builder:flatbuffers.Builder) {
  builder.startObject(2);
}

static addKey(builder:flatbuffers.Builder, keyOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, keyOffset, 0);
}

static addValue(builder:flatbuffers.Builder, valueOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, valueOffset, 0);
}

static endBlockEventAttributeFlatBuffer(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createBlockEventAttributeFlatBuffer(builder:flatbuffers.Builder, keyOffset:flatbuffers.Offset, valueOffset:flatbuffers.Offset):flatbuffers.Offset {
  BlockEventAttributeFlatBuffer.startBlockEventAttributeFlatBuffer(builder);
  BlockEventAttributeFlatBuffer.addKey(builder, keyOffset);
  BlockEventAttributeFlatBuffer.addValue(builder, valueOffset);
  return BlockEventAttributeFlatBuffer.endBlockEventAttributeFlatBuffer(builder);
}
}
