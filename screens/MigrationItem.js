import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function HighlightText({ text, input }) {
  if (!input) return <Text>{text}</Text>;

  const lowerText = text.toLowerCase();
  const words = input.toLowerCase().trim().split(/\s+/);

  // 🔴 đỏ nếu 2 từ liền nhau
  if (words.length >= 2) {
    const phrase = words[0] + ' ' + words[1];
    const idx = lowerText.indexOf(phrase);
    if (idx !== -1) {
      return (
        <Text>
          {text.slice(0, idx)}
          <Text style={styles.red}>
            {text.slice(idx, idx + phrase.length)}
          </Text>
          {text.slice(idx + phrase.length)}
        </Text>
      );
    }
  }

  // 🟨 vàng từng từ
  let parts = [{ text, highlight: false }];

  words.forEach(word => {
    const newParts = [];
    parts.forEach(p => {
      if (p.highlight) return newParts.push(p);

      const i = p.text.toLowerCase().indexOf(word);
      if (i === -1) return newParts.push(p);

      newParts.push(
        { text: p.text.slice(0, i), highlight: false },
        { text: p.text.slice(i, i + word.length), highlight: true },
        { text: p.text.slice(i + word.length), highlight: false },
      );
    });
    parts = newParts;
  });

  return (
    <Text>
      {parts.map((p, i) => (
        <Text key={i} style={p.highlight ? styles.yellow : null}>
          {p.text}
        </Text>
      ))}
    </Text>
  );
}

export default function MigrationItem({ item, input }) {
  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.titleOld}>ĐỊA DANH CŨ</Text>
        <Text style={styles.titleNew}>ĐỊA DANH MỚI</Text>
      </View>

      {/* BODY */}
      <View style={styles.body}>
        {/* LEFT */}
        <View style={styles.left}>
          {item.DETAIL.map((d, i) => {
            const isLast = i === item.DETAIL.length - 1;
            return (
              <View
                key={i}
                style={[styles.block, isLast && styles.lastBlock]}
              >
                <Text style={styles.commune}>
                  <HighlightText text={d.commune} input={input} />
                </Text>

                <Text style={styles.sub}>
                  <HighlightText text={d.district} input={input} />
                </Text>

                <Text style={styles.sub}>
                  <HighlightText text={d.province} input={input} />
                </Text>
              </View>
            );
          })}
        </View>

        {/* RIGHT */}
<View style={styles.right}>
  <Text style={styles.newCommune}>
    <HighlightText
      text={item.COMMUNE}
      input={input}
    />
  </Text>

  <Text style={styles.newProvince}>
    <HighlightText
      text={item.PROVINCE}
      input={input}
    />
  </Text>
</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* CARD */
  card: {
    marginHorizontal: 14,
    marginVertical: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },

  titleOld: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  titleNew: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
    textAlign: 'right',
  },

  /* BODY */
  body: {
    flexDirection: 'row',
    padding: 14,
  },

  left: {
    flex: 2,
    paddingRight: 12,
  },

  right: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },

  /* LEFT BLOCK */
  block: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  lastBlock: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },

  commune: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },

  sub: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748B',
  },

  /* RIGHT */
  newCommune: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15803D',
    textAlign: 'center',
  },

  newProvince: {
    marginTop: 4,
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
  },

  /* HIGHLIGHT */
  yellow: {
    backgroundColor: '#FEF08A',
  },

  red: {
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
  },
});
