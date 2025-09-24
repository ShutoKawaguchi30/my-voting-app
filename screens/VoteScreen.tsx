import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

// グリッドの列数と行数（10×10）
const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;
// 使用可能な最大ポイント（右上1マスを除いて99）
const MAX_POINTS = 99;

export default function VoteScreen({ navigation, route }) {
  const { age, gender, candidates = [] } = route.params ?? {};
  const [votes, setVotes] = React.useState(
    new Array(candidates.length).fill(0)
  );
  // 配置されたブロックの情報を保持
  const [blocks, setBlocks] = React.useState([]);

  // 候補がない場合の表示
  if (!candidates || candidates.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>候補が指定されていません</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 指定した位置 (x, y) に指定サイズのブロックを配置できるかチェック
  const canPlaceBlock = (grid, x, y, size) => {
    if (x + size > GRID_WIDTH || y + size > GRID_HEIGHT) return false;
    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        // 右上のマスを除外＆他のブロックと重ならないようにチェック
        if (
          (y + dy === 0 && x + dx === GRID_WIDTH - 1) ||
          grid[y + dy][x + dx] !== -1
        )
          return false;
      }
    }
    return true;
  };

  // ブロックを配置する位置を探し、gridを更新
  const placeBlock = (grid, size, index) => {
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (canPlaceBlock(grid, x, y, size)) {
          for (let dy = 0; dy < size; dy++) {
            for (let dx = 0; dx < size; dx++) {
              grid[y + dy][x + dx] = index;
            }
          }
          return { x, y };
        }
      }
    }
    return null; // 配置できる場所がなければ null
  };

  // 投票数を更新し、ブロックを再配置する関数
  const updateVote = (index, vote) => {
    const size = vote; // 正方形の一辺の長さ
    const totalUsed =
      vote === 0
        ? votes.reduce((sum, v) => sum + v * v, 0) - votes[index] * votes[index]
        : votes.reduce((sum, v, i) => (i === index ? sum : sum + v * v), 0);
    const newPoints = size * size;
    if (totalUsed + newPoints > MAX_POINTS) return; // ポイントオーバーなら中止

    const newVotes = [...votes];
    newVotes[index] = vote;

    // グリッドを初期化し、すべてのブロックを再配置
    const newGrid = Array.from({ length: GRID_HEIGHT }, () =>
      Array(GRID_WIDTH).fill(-1)
    );
    const newBlocks = [];
    let placementPossible = true;
    for (let i = 0; i < newVotes.length; i++) {
      if (newVotes[i] > 0) {
        const s = newVotes[i];
        const pos = placeBlock(newGrid, s, i);
        if (!pos) {
          placementPossible = false;
          break; // 配置できなければループを中断
        }
        newBlocks.push({ ...pos, size: s, index: i });
      }
    }

    if (placementPossible) {
      setVotes(newVotes);
      setBlocks(newBlocks);
    }
  };

  // 99マスグリッドを描画（右上1マスを透明にする）
  const renderGrid = () => {
    const grid = Array.from({ length: GRID_HEIGHT }, () =>
      Array(GRID_WIDTH).fill(null)
    );
    blocks.forEach(({ x, y, size, index }) => {
      for (let dy = 0; dy < size; dy++) {
        for (let dx = 0; dx < size; dx++) {
          if (!(y + dy === 0 && x + dx === GRID_WIDTH - 1)) {
            grid[y + dy][x + dx] = index;
          }
        }
      }
    });
    return (
      <View style={styles.gridContainer}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => {
              const isTopRight = rowIndex === 0 && colIndex === GRID_WIDTH - 1;
              return (
                <View
                  key={colIndex}
                  style={[
                    styles.pointSquare,
                    isTopRight
                      ? styles.transparentSquare
                      : {
                          backgroundColor:
                            cell === null ? '#eee' : getColor(cell),
                        },
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  // 候補ごとに色を割り当てる関数
  const getColor = (index) => {
    const colors = [
      '#f44336', '#2196f3', '#4caf50', '#ff9800', '#9c27b0',
      '#00bcd4', '#795548', '#607d8b', '#e91e63', '#8bc34a',
    ];
    return colors[index % colors.length];
  };

  // 投票結果を別画面へ送信
  const submitVotes = () => {
    const results = votes.map((v, i) => ({
      candidate: candidates[i],
      votes: v,
      points: v * v,
    }));
    navigation.navigate('Result', { age, gender, results });
  };
  
  // 画面描画
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>クアドラティックボーティング</Text>
        <Text style={styles.points}>
          残りポイント: {MAX_POINTS - votes.reduce((sum, v) => sum + v * v, 0)}
        </Text>
        {renderGrid()}
      </View>

      {/* Scrollable Content Section */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {candidates.map((name, i) => (
          <View key={i} style={styles.candidateRow}>
            <View style={styles.nameContainer}>
              <View
                style={[styles.colorBox, { backgroundColor: getColor(i) }]}
              />
              <Text style={styles.name}>{name}</Text>
            </View>
            <Button
              title="-"
              onPress={() => updateVote(i, Math.max(0, votes[i] - 1))}
            />
            <Text style={styles.vote}>{votes[i]}票</Text>
            <Button title="+" onPress={() => updateVote(i, votes[i] + 1)} />
          </View>
        ))}
      </ScrollView>

      {/* Footer Section (Fixed at the bottom) */}
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          {/* 左側の「政策を変更」ボタン */}
          <TouchableOpacity
            style={[styles.changePolicyButton, styles.button]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.changePolicyButtonText}>政策を変更</Text>
          </TouchableOpacity>

          {/* 右側の「投票を送信」ボタン */}
          <TouchableOpacity
            style={[styles.submitButton, styles.button]}
            onPress={submitVotes}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>投票を送信</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// スタイル定義
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  points: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
  },
  gridContainer: {
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
  },
  pointSquare: {
    width: 20,
    height: 20,
    margin: 1,
    borderRadius: 4,
  },
  transparentSquare: {
    width: 20,
    height: 20,
    margin: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  candidateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 12,
    borderRadius: 4,
  },
  name: {
    fontSize: 16,
    flex: 1,
  },
  vote: {
    width: 50,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
  },
  changePolicyButton: {
    backgroundColor: '#d32f2f', // 赤色
  },
  submitButton: {
    backgroundColor: '#4A90E2', // 青色
  },
  changePolicyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});