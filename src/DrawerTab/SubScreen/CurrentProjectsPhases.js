import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import Header from '../../Components/Header';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import DownloadBtn from '../../Components/DownloadBtn';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';

const CustomDropdown = ({ label, options, selectedValue, onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginBottom: hp('2.5%') }}>
      <View style={styles.dropdownRow}>
        <Text style={styles.projectsTitle}>{label}</Text>
        <TouchableOpacity
          style={[styles.dropdownButton, open && styles.dropdownButtonOpen]}
          onPress={() => setOpen(!open)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.dropdownText,
              !selectedValue && styles.placeholderText,
            ]}
          >
            {selectedValue
              ? options.find(opt => opt.value === selectedValue)?.label
              : `Select ${label}`}
          </Text>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#1d9b20"
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>
      </View>

      {open && (
        <View style={styles.dropdownOptions}>
          {options.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                selectedValue === option.value && styles.selectedOption,
              ]}
              onPress={() => {
                onSelect(option.value);
                setOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedValue === option.value && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const CurrentProjectsPhases = ({}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedCore, setSelectedCore] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const navigation = useNavigation();

  const sections = [
    {
      id: '1',
      title: 'Overall Completion',
      lastWeek: '0.2%',
      update: 'completion to Date',
    },
    {
      id: '2',
      title: 'Overall Productivity',
      lastWeek: '1.76%',
      update: 'Last week Productivity',
    },
  ];

  const data = [
    {
      id: '1',
      title: 'Design',
      lastWeek: '7.83%',
      redProgress: 90,
      greenProgress: 70,
    },
    {
      id: '2',
      title: 'Structure',
      lastWeek: '7.83%',
      redProgress: 80,
      greenProgress: 60,
    },
    {
      id: '3',
      title: 'Site Setup',
      lastWeek: '7.83%',
      redProgress: 0,
      greenProgress: 5,
    },
    {
      id: '4',
      title: 'Sub Structure',
      lastWeek: '7.83%',
      redProgress: 0,
      greenProgress: 5,
    },
    {
      id: '5',
      title: 'Finishes',
      lastWeek: '7.83%',
      redProgress: 0,
      greenProgress: 5,
    },
    {
      id: '6',
      title: 'Handover',
      lastWeek: '7.83%',
      redProgress: 0,
      greenProgress: 5,
    },
  ];

  const renderHorizontalItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.horizontalCard}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>{item.lastWeek}</Text>
          <Text style={styles.updateText}>{item.update}</Text>
        </View>
      </View>
    </View>
  );

  const renderVerticalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.verticalCard}
      onPress={() => {
        if (item.title === 'Design') {
          navigation.navigate('DesignTask', { project: item });
        } else if (item.title === 'Finishes') {
          setModalVisible(true);
        }
      }}
    >
      <View style={styles.leftContainer}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <Text style={styles.legendText}>Last Week: {item.lastWeek}</Text>
      </View>
      <View style={styles.progressContainer}>
        <AnimatedCircularProgress
          size={wp('15%')}
          width={6}
          fill={item.redProgress}
          tintColor="red"
          backgroundColor="#e0e0e0"
          rotation={0}
        />
        <AnimatedCircularProgress
          size={wp('12%')}
          width={7}
          fill={item.greenProgress}
          tintColor="green"
          backgroundColor="#e0e0e0"
          rotation={0}
          style={styles.innerProgress}
        >
          {() => <Text style={styles.progressText}>{item.greenProgress}%</Text>}
        </AnimatedCircularProgress>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Finishes</Text>
            <CustomDropdown
              label="Building"
              options={[
                { label: 'A1', value: 'A' },
                { label: 'A2', value: 'B' },
                { label: 'A3', value: 'C' },
              ]}
              selectedValue={selectedBuilding}
              onSelect={setSelectedBuilding}
            />

            <CustomDropdown
              label="Core"
              options={[
                { label: 'Core 1', value: 'C1' },
                { label: 'Core 2', value: 'C2' },
              ]}
              selectedValue={selectedCore}
              onSelect={setSelectedCore}
            />

            <CustomDropdown
              label="Level"
              options={[
                { label: 'Level 1', value: 'L1' },
                { label: 'Level 2', value: 'L2' },
              ]}
              selectedValue={selectedLevel}
              onSelect={setSelectedLevel}
            />

            <CustomDropdown
              label="Unit"
              options={[
                { label: 'Unit 1', value: 'U101' },
                { label: 'Unit 2', value: 'U102' },
              ]}
              selectedValue={selectedUnit}
              onSelect={setSelectedUnit}
            />

            {/* Buttons */}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#fff' }]}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={[styles.modalButtonText, { color: 'red' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#5cb85c' }]}
                onPress={() => {
                  if (selectedBuilding && selectedCore) {
                    setModalVisible(false);
                    navigation.navigate('CoreTask', {
                      building: selectedBuilding,
                      core: selectedCore,
                      level: selectedLevel,
                      unit: selectedUnit,
                    });
                  } else {
                    alert(
                      'Please select both Building and Core before proceeding.',
                    );
                  }
                }}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Main Screen */}
      <ScrollView style={styles.scrollView}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.title}>Oran Park Resi 3</Text>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={hp('2.8%')} color="#fff" />
          </TouchableOpacity>
        </View>

        <DownloadBtn title="Download Report" bgColor="#1d9b20" />

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={sections}
          renderItem={renderHorizontalItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.horizontalFlatListContent}
          style={{ marginVertical: hp('2%') }}
        />

        <FlatList
          numColumns={2}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          data={data}
          renderItem={renderVerticalItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.verticalFlatListContent}
          columnWrapperStyle={styles.columnWrapper}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholderText: { color: '#999' },
  dropdownText: {
    fontSize: hp(1.8),
    color: '#333',
  },
  projectsTitle: {
    fontSize: hp(2),
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('3%'),
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    minWidth: wp('45%'),
  },
  dropdownButtonOpen: {
    borderColor: '#1d9b20',
    backgroundColor: '#f0f8f0',
  },
  dropdownText: {
    fontSize: hp(1.8),
    color: '#333',
  },
  placeholderText: { color: '#999' },
  dropdownIcon: { marginLeft: wp('2%') },
  dropdownOptions: {
    marginTop: hp('1%'),
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    borderWidth: 1.5,
    borderColor: '#D3D3D3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: hp(1.7),
    color: '#333',
  },
  optionItem: {
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: { backgroundColor: '#f0f8f0' },
  optionText: { fontSize: hp(1.8), color: '#333' },
  selectedOptionText: { fontWeight: '600', color: '#1d9b20' },
  modalButtonRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    gap: hp('2%'),
    marginTop: hp('2%'),
  },
  modalButton: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('5%'),
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: hp('1.8%'),
    fontWeight: '600',
    textAlign: 'center',
  },
  iconContainer: {
    backgroundColor: 'gray',
    padding: wp('1%'),
    borderRadius: wp('5%'),
  },
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollView: { flex: 1, padding: wp('5%') },
  title: { fontSize: hp('2.5%'), fontWeight: 'bold', color: '#333' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBox: {
    width: wp('85%'),
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  horizontalFlatListContent: { paddingHorizontal: wp('2%') },
  cardContainer: { width: wp('42%'), marginHorizontal: wp('1%') },
  horizontalCard: {
    backgroundColor: '#fff',
    padding: wp('1%'),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('16%'),
  },
  cardTitle: { fontSize: hp('1.8%'), fontWeight: '600', color: '#333' },
  percentageContainer: { alignItems: 'center' },
  percentageText: { fontSize: hp('3%'), fontWeight: 'bold', color: '#1d9b20' },
  updateText: { fontSize: hp('1.5%'), color: '#666', marginTop: hp('0.5%') },
  verticalFlatListContent: {
    paddingHorizontal: wp('1%'),
    paddingBottom: hp('2%'),
  },
  columnWrapper: { justifyContent: 'space-between', paddingBottom: wp('1.3%') },
  verticalCard: {
    backgroundColor: '#fff',
    padding: wp('3%'),
    marginVertical: hp('0.5%'),
    marginHorizontal: wp('1%'),
    borderRadius: 12,
    width: wp('43%'),
    elevation: 3,
    minHeight: hp('10%'),
  },
  leftContainer: { flex: 1, marginRight: wp('2%'), justifyContent: 'center' },
  projectTitle: { fontSize: hp('1.8%'), fontWeight: 'bold', color: '#333' },
  legendText: { fontSize: hp('1.5%'), color: '#666' },
  progressContainer: {
    position: 'relative',
    width: wp('15%'),
    height: wp('15%'),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: hp('1.5%'),
  },
  innerProgress: { position: 'absolute' },
  progressText: { fontSize: hp('1.3%'), fontWeight: 'bold', color: 'green' },
});

export default CurrentProjectsPhases;
