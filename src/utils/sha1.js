function encodeUTF8(s) {
  let i; const r = []; let c; let x
  for (i = 0; i < s.length; i++) {
    if ((c = s.charCodeAt(i)) < 0x80) r.push(c)
    else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F))
    else {
      if ((x = c ^ 0xD800) >> 10 === 0) {
        c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000
        r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F))
      } else r.push(0xE0 + (c >> 12 & 0xF))
      r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F))
    }
  }
  return r
}

// 字符串加密成 hex 字符串
export function sha1(str) {
  const m = [1732584193, -271733879, null, null, -1009589776]
  const data = new Uint8Array(encodeUTF8(str))
  let i, j, t
  const l = ((data.length + 8) >>> 6 << 4) + 16
  const str_data = new Uint8Array(l << 2)
  str_data.set(new Uint8Array(data.buffer))
  const s = new Uint32Array(str_data.buffer)
  for (t = new DataView(s.buffer), i = 0; i < l; i++)s[i] = t.getUint32(i << 2)
  s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8)
  s[l - 1] = data.length << 3
  const w = []; const f = [
    function() {
      return m[1] & m[2] | ~m[1] & m[3]
    },
    function() {
      return m[1] ^ m[2] ^ m[3]
    },
    function() {
      return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]
    },
    function() {
      return m[1] ^ m[2] ^ m[3]
    }
  ]; const rol = function(n, c) {
    return n << c | n >>> (32 - c)
  }
  const k = [1518500249, 1859775393, -1894007588, -899497514]
  m[2] = ~m[0]
  m[3] = ~m[1]
  for (i = 0; i < s.length; i += 16) {
    const o = m.slice(0)
    for (j = 0; j < 80; j++) {
      w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)
      t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0
      m[1] = rol(m[1], 30)
      m.pop()
      m.unshift(t)
    }
    for (j = 0; j < 5; j++)m[j] = m[j] + o[j] | 0
  }
  t = new DataView(new Uint32Array(m).buffer)
  for (i = 0; i < 5; i++)m[i] = t.getUint32(i << 2)

  return Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function(e) {
    return (e < 16 ? '0' : '') + e.toString(16)
  }).join('')
}
