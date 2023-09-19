export function toBuffer(obj: any) {
  return Buffer.from(JSON.stringify(obj));
}
