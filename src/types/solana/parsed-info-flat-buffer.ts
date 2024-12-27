// automatically generated by the FlatBuffers compiler, do not modify

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import * as flatbuffers from 'flatbuffers';

import { ParsedInfoDetailsFlatBuffer } from '../solana/parsed-info-details-flat-buffer.js';


export class ParsedInfoFlatBuffer {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):ParsedInfoFlatBuffer {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsParsedInfoFlatBuffer(bb:flatbuffers.ByteBuffer, obj?:ParsedInfoFlatBuffer):ParsedInfoFlatBuffer {
  return (obj || new ParsedInfoFlatBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsParsedInfoFlatBuffer(bb:flatbuffers.ByteBuffer, obj?:ParsedInfoFlatBuffer):ParsedInfoFlatBuffer {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new ParsedInfoFlatBuffer()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

info(obj?:ParsedInfoDetailsFlatBuffer):ParsedInfoDetailsFlatBuffer|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? (obj || new ParsedInfoDetailsFlatBuffer()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

type():string|null
type(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
type(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

static startParsedInfoFlatBuffer(builder:flatbuffers.Builder) {
  builder.startObject(2);
}

static addInfo(builder:flatbuffers.Builder, infoOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, infoOffset, 0);
}

static addType(builder:flatbuffers.Builder, typeOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, typeOffset, 0);
}

static endParsedInfoFlatBuffer(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  builder.requiredField(offset, 4) // info
  return offset;
}

static createParsedInfoFlatBuffer(builder:flatbuffers.Builder, infoOffset:flatbuffers.Offset, typeOffset:flatbuffers.Offset):flatbuffers.Offset {
  ParsedInfoFlatBuffer.startParsedInfoFlatBuffer(builder);
  ParsedInfoFlatBuffer.addInfo(builder, infoOffset);
  ParsedInfoFlatBuffer.addType(builder, typeOffset);
  return ParsedInfoFlatBuffer.endParsedInfoFlatBuffer(builder);
}
}
