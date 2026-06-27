import { encode, decode } from '@msgpack/msgpack';

export default class ZKPMCodec {
  encode<T>(data: T): Uint8Array {
    return encode(data);
  }

  decode<T>(bytes: Uint8Array): T {
    return decode(bytes) as T;
  }
}
