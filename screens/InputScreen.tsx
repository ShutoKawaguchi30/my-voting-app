import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
  Platform,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CustomPicker = ({ selectedValue, onValueChange, placeholder, options }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedLabel = options.find((option) => option.value === selectedValue)?.label || placeholder;

  return (
    <>
      <Pressable
        style={styles.pickerButton}
        onPress={() => {
          Keyboard.dismiss();
          setModalVisible(true);
        }}
      >
        <Text style={[styles.pickerButtonText, !selectedValue && styles.placeholderText]}>
          {selectedLabel}
        </Text>
      </Pressable>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Pressable onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCloseText}>完了</Text>
                </Pressable>
              </View>
              <Picker
                selectedValue={selectedValue}
                onValueChange={(itemValue) => {
                  onValueChange(itemValue);
                  if (Platform.OS === 'android') setModalVisible(false);
                }}
                style={styles.picker}
              >
                {options.map((item, index) => (
                  <Picker.Item key={index} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

// メインコンポーネント
export default function InputScreen({ navigation }) {
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const [region, setRegion] = useState('');

  const onStartVoting = () => {
    Keyboard.dismiss();
    if (!ageGroup || !gender || !region) {
      Alert.alert('エラー', '年代、性別、居住地域を入力してください');
      return;
    }
    navigation.navigate('SelectPolicies', { ageGroup, gender, region });
  };

  const ageGroupOptions = [
    { label: '選択してください', value: '' },
    { label: '10代', value: '10s' },
    { label: '20代', value: '20s' },
    { label: '30代', value: '30s' },
    { label: '40代', value: '40s' },
    { label: '50代', value: '50s' },
    { label: '60代', value: '60s' },
    { label: '70代', value: '70s' },
    { label: '80代以上', value: '80s+' },
  ];

  const genderOptions = [
    { label: '選択してください', value: '' },
    { label: '男性', value: '男性' },
    { label: '女性', value: '女性' },
    { label: 'その他', value: 'その他' },
  ];
  
  const regionOptions = [
    { label: '選択してください', value: '' },
    { label: '滋賀県', value: '滋賀県' },
    { label: '滋賀県外', value: '滋賀県外' },
  ];

  return (
    <SafeAreaView style={styles.rootContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* クアドラティックボーティングの説明カード */}
          <View style={styles.descriptionCard}>
            <Text style={styles.cardTitle}>あなたは99ポイント持っています</Text>
            <Text style={styles.cardSubtitle}>
              投じる票数の、二乗のポイントが必要です
            </Text>
            <Text style={styles.exampleTitle}>例:</Text>
            <Text style={styles.exampleText}>
              ・1票投票 → 1の二乗 = 1ポイント必要{'\n'}
              ・2票投票 → 2の二乗 = 4ポイント必要{'\n'}
              ・3票投票 → 3の二乗 = 9ポイント必要
            </Text>
          </View>

          {/* 年代の選択セクション */}
          <Text style={styles.label}>年代:</Text>
          <CustomPicker
            selectedValue={ageGroup}
            onValueChange={setAgeGroup}
            placeholder="選択してください"
            options={ageGroupOptions.slice(1)}
          />

          {/* 性別の選択セクション */}
          <Text style={styles.label}>性別:</Text>
          <CustomPicker
            selectedValue={gender}
            onValueChange={setGender}
            placeholder="選択してください"
            options={genderOptions.slice(1)}
          />

          {/* 居住地域の選択セクション */}
          <Text style={styles.label}>居住地域:</Text>
          <CustomPicker
            selectedValue={region}
            onValueChange={setRegion}
            placeholder="選択してください"
            options={regionOptions.slice(1)}
          />
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* ボタンを画面下部に固定するためのコンテナ */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { transform: [{ scale: 0.98 }], opacity: 0.8 },
          ]}
          onPress={onStartVoting}
        >
          <Text style={styles.buttonText}>投票を開始</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// スタイルシート
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  contentContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 24,
    paddingTop: 50,
  },
  descriptionCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E8EBF2',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 8,
    marginBottom: 16,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#777',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 14,
    color: '#777',
    lineHeight: 22,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8EBF2',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  pickerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8EBF2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#F5F7FA',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    padding: 16,
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  picker: {
    height: 220,
  },
});