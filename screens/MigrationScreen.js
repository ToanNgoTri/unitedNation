import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import data from '../asset/data.json';
import MigrationItem from './MigrationItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MigrationScreen() {
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);

  const insets = useSafeAreaInsets(); // lất chiều cao để menu top iphone

  const normalize = s => s.toLowerCase().replace(/\s+/g, ' ').trim();

  useEffect(() => {
    const key = normalize(input);
    if (!key) {
      setList([]);
      return;
    }

    const words = key.split(' ');

    const result = data
      .map(item => {
        let score = 0;

        const newCommune = normalize(item.COMMUNE || '');
        const newProvince = normalize(item.PROVINCE || '');

        // ===== ƯU TIÊN ĐỊA DANH MỚI =====
        if (
          newCommune.includes(key) ||
          (words.length >= 2 &&
            newCommune.includes(words.slice(0, -2).join(' ')) &&
            newProvince.includes(words.slice(-2).join(' ')))
        ) {
          score = Math.max(score, 100);
        }

        // ===== DETAIL =====
        item.DETAIL?.forEach(d => {
          const commune = normalize(d.commune);
          const district = normalize(d.district);
          const province = normalize(d.province);

          // 🔴 LIỀN NHAU CHUẨN
          if (
            words.length >= 2 &&
            commune.includes(words.slice(0, -2).join(' ')) &&
            province.includes(words.slice(-2).join(' '))
          ) {
            score = Math.max(score, 90);
          } else if (commune.includes(key)) {
            score = Math.max(score, 80);
          } else {
            const fields = [commune, district, province];
            if (words.every(w => fields.some(f => f.includes(w)))) {
              score = Math.max(score, 10);
            }
          }
        });

        return score > 0 ? { ...item, _score: score } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b._score - a._score);

    setList(result);
  }, [input]);

  return (
    <View style={styles.container}>
      {/* ===== HEADER GỌN ===== */}
      <View style={[styles.header, { paddingTop: insets.top + 5 }]}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Tra cứu địa danh</Text>

          {input !== '' && (
            <View style={styles.resultBadge}>
              <Text style={styles.resultText}>{list.length} kết quả</Text>
            </View>
          )}
        </View>

        {/* SEARCH */}
        <View style={styles.searchWrapper}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '90%',
              // backgroundColor: 'red',
            }}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              placeholder="Nhập xã, huyện, tỉnh…"
              placeholderTextColor="#9CA3AF"
              value={input}
              onChangeText={setInput}
              style={styles.input}
            />
          </View>
          {input !== '' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '10%',
                // backgroundColor: 'blue',
                                  justifyContent: 'center',

              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setInput('');
                  // Keyboard.dismiss();
                }}
                style={{
                  // width: '10%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 20, color: '#9CA3AF' }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* ===== CONTENT TO – FULL ===== */}
      <View style={styles.content}>
        {input !== '' && list.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
            <Text style={styles.emptySub}>Hãy thử từ khóa khác</Text>
          </View>
        ) : (
          <FlatList
            data={list}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <MigrationItem item={item} input={input} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ROOT */
  container: {
    flex: 1,
    backgroundColor: '#EEF2F5',
  },

  /* HEADER NHỎ */
  header: {
    paddingTop: 14,
    paddingHorizontal: 14,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  resultBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  resultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
  },

  /* SEARCH */
  searchWrapper: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  searchIcon: {
    fontSize: 15,
    marginRight: 6,
  },

  input: {
    flex: 1,
    height: 42,
    fontSize: 14,
    color: '#0F172A',
  },

  /* CONTENT TO */
  content: {
    flex: 1,
    // paddingTop: 8,
  },

  list: {
    paddingBottom: 28,
  },

  /* EMPTY */
  empty: {
    marginTop: 80,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },

  emptySub: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },
});
