import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types'; // ▼ 変更点: prop-typesをインポート

// ダミーデータ
const allCandidates = [
  '水質保全', '生態系保全', 'ゴミ対策', '漁業資源保護', '外来種対策',
  '水草対策', '温暖化対策', '湖魚料理などの継承', 'レジャー対策', '環境学習',
];

const CandidateItemComponent = ({ candidate, isRemoved, onToggle }) => (
  <Pressable
    style={({ pressed }) => [
      styles.candidateItem,
      isRemoved && styles.candidateItemRemoved,
      pressed && { opacity: 0.7 },
    ]}
    onPress={() => onToggle(candidate)}
  >
    <Text style={[styles.candidateText, isRemoved && styles.candidateTextRemoved]}>
      {candidate}
    </Text>
    {isRemoved && (
      <Ionicons name="refresh-circle" size={24} color="#555" />
    )}
  </Pressable>
);

CandidateItemComponent.propTypes = {
  candidate: PropTypes.string.isRequired,
  isRemoved: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

const CandidateItem = React.memo(CandidateItemComponent);


export default function SelectPoliciesScreen({ navigation, route }) {

  const { age, gender } = route.params;
  const [removedPolicies, setRemovedPolicies] = useState([]);

  const togglePolicy = (policy) => {
    setRemovedPolicies(prev =>
      prev.includes(policy)
        ? prev.filter(p => p !== policy)
        : [...prev, policy]
    );
  };

  const handleNext = () => {
    const supportedPolicies = allCandidates.filter(
      p => !removedPolicies.includes(p)
    );
    if (supportedPolicies.length === 0) {
      return;
    }
    navigation.navigate('Vote', {
      candidates: supportedPolicies,
      ageGroup: age, // 「age」を「ageGroup」に変更します
      gender: gender,
      region: region, // 居住地域を追加します
    });
  };

  const isNextButtonDisabled = allCandidates.length === removedPolicies.length;

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.instructionText}>
          {`関心のない（投票しない）\n環境対策を選んでください`} </Text>
        <FlatList
          data={allCandidates}
          renderItem={({ item }) => (
            <CandidateItem
              candidate={item}
              isRemoved={removedPolicies.includes(item)}
              onToggle={togglePolicy}
            />
          )}
          keyExtractor={item => item}
          contentContainerStyle={styles.listContentContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.nextButton,
            isNextButtonDisabled && styles.nextButtonDisabled,
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleNext}
          disabled={isNextButtonDisabled}
        >
          <Text style={styles.nextButtonText}>次へ</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  rootContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  instructionText: {
    fontSize: 20,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  candidateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8EBF2',
  },
  candidateItemRemoved: {
    backgroundColor: '#EAEAEA',
    opacity: 0.6,
  },
  candidateText: {
    fontSize: 16,
    color: '#333',
  },
  candidateTextRemoved: {
    color: '#888',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#F5F7FA',
  },
  nextButton: {
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
  nextButtonDisabled: {
    backgroundColor: '#C5D0DC',
    shadowColor: 'transparent',
    elevation: 0,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});