import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable, // 戻るボタン用にPressableを使用
  Dimensions, // 画面サイズを取得して棒グラフの幅を計算
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// グラフの色を統一したパレットに
const getPointsColor = (index) => {
  const colors = ['#f44336', '#4A90E2', '#4CAF50', '#ff9800', '#9c27b0', '#00bcd4'];
  return colors[index % colors.length];
};

// 棒グラフのアニメーションに使用するコンポーネント
// ただし、今回は静的なデザイン改善のため、アニメーションは含まず、見た目のみを改善します。
const BarGraph = ({ color, percent }) => {
  return (
    <View style={styles.barGraphContainer}>
      <View style={[styles.barGraph, { width: `${percent}%`, backgroundColor: color }]} />
      {/* グラフの上にパーセンテージテキストを配置 */}
      <Text style={styles.barPercentText}>{percent}%</Text>
    </View>
  );
};

export default function ResultScreen({ navigation, route }) {
  // 画面遷移時に渡されるパラメータ
  const { ageGroup, gender, region, results } = route.params;

  // 全体のポイントを計算
  const totalPoints = results.reduce((sum, r) => sum + r.points, 0);

  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* メインの結果セクション */}
        <View style={styles.mainContent}>
          <Text style={styles.mainTitle}>投票結果</Text>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfoText}>年代: {ageGroup}</Text>
            <Text style={styles.userInfoText}>性別: {gender}</Text>
            <Text style={styles.userInfoText}>居住地: {region}</Text>
          </View>
        </View>

        {/* 各政策の結果カード */}
        {results.map((r, i) => {
          const percent = totalPoints > 0 ? Math.round((r.points / totalPoints) * 100) : 0;
          const color = getPointsColor(i);
          return (
            <View key={i} style={styles.resultCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardColorBox, { backgroundColor: color }]} />
                <Text style={styles.cardTitleText}>{r.candidate}</Text>
              </View>
              <Text style={styles.cardInfoText}>{r.votes}票 ({r.points}ポイント)</Text>
              
              {/* 棒グラフコンポーネント */}
              <BarGraph color={color} percent={percent} />
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA', // 統一された背景色
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50, // iPhoneX以降のnotch対応
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBF2',
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100, // 戻るボタンの幅を確保
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF', // iOSの標準的な青
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  backButtonPlaceholder: { // 中央揃えのためのスペーサー
    width: 100,
  },
  scrollContent: {
    padding: 24,
  },
  mainContent: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userInfoText: {
    fontSize: 16,
    color: '#555',
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardColorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 12,
  },
  cardTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  cardInfoText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 16,
  },
  barGraphContainer: {
    height: 20,
    backgroundColor: '#E8EBF2', // バーの背景色
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  barGraph: {
    height: '100%',
    borderRadius: 10,
  },
  barPercentText: {
    position: 'absolute',
    left: 12,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});