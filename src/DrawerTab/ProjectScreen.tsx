import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import Header from '../Components/Header';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProjectScreen() {
  const [searchText, setSearchText] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('active'); 
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigation = useNavigation();

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Archive', value: 'archive' },
  ];
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('${baseUrl}projects/query?status=Active');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      if (result && result.data) {
        // Transform API data to match our app format
        const formattedData = result.data.map(item => ({
          id: item.id.toString(),
          title: item.name,
          profile_picture: item.profile_picture,
          addressLine1: item.location?.address_line_1 || 'Address not available',
          addressLine2: item.location?.address_line_2 || '',
          addressLine3: item.location?.city + ', ' + item.location?.state || 'Australia',
          image: item.profile_picture ? { uri: item.profile_picture } : require('../assets/images/house.jpg'),
          project_id: item.id // Save project_id for AsyncStorage
        }));
        
        setProjectData(formattedData);
      } else {
        console.log('No data found in response');
        setProjectData([]);
      }
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to dummy data if API fails
      setProjectData([
        {
          id: '1',
          title: 'Maya Hill Apartments',
          addressLine1: '1- - 16 Patricia St',
          addressLine2: 'Mays Hill NSW 2145',
          addressLine3: 'Australia', 
          image: require('../assets/images/house.jpg'),
          project_id: '1'
        },
        {
          id: '2',
          title: 'Park Sydney Stage 2',
          addressLine1: '57 Ashmore Street',
          addressLine2: 'Erisfineville, New South Wales 2043',
          addressLine3: 'Australia',
          image: require('../assets/images/house.jpg'),
          project_id: '2'
        },
        {
          id: '3',
          title: 'Oran Park Rest 3',
          addressLine1: '62 Central Avenue',
          addressLine2: 'Oran Park, New South Wales 2570',
          addressLine3: 'Australia',
          image: require('../assets/images/house.jpg'),
          project_id: '3'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Save project_id to AsyncStorage
  const saveProjectId = async (projectId) => {
    try {
      await AsyncStorage.setItem('selected_project_id', projectId.toString());
      console.log('Project ID saved:', projectId);
      
      // Optional: You can also save other project details if needed
      const projectDataToSave = {
        project_id: projectId,
        saved_at: new Date().toISOString()
      };
      await AsyncStorage.setItem('project_data', JSON.stringify(projectDataToSave));
      
    } catch (error) {
      console.error('Error saving project ID:', error);
    }
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const filteredData = projectData.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleProjectPress = async (item) => {
    // Save project_id to AsyncStorage
    await saveProjectId(item.project_id);
    
    // Navigate based on project
    if (item.title === 'Oran Park Rest 3') {
      navigation.navigate('CurrentProjectsPhases', { 
        project: item,
        project_id: item.project_id 
      });
    } else {
      // Default navigation for other projects
      navigation.navigate('ProjectDetails', { 
        project: item,
        project_id: item.project_id 
      });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => handleProjectPress(item)}
    >
      <View style={styles.projectCard}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <Image
            source={item.image}
            style={{
              height: hp('6%'),
              width: wp('20%'),
              marginRight: wp('4%'), 
              borderRadius: wp('1%')
            }}
            onError={() => console.log('Image loading failed for:', item.title)}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.projectAddress}>{item.addressLine1}</Text>
            <Text style={styles.projectAddress}>{item.addressLine2}</Text>
            <Text style={styles.projectAddress}>{item.addressLine3}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Header toggleDrawer={() => navigation.toggleDrawer()} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading projects...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header toggleDrawer={() => navigation.toggleDrawer()} />
      <View style={styles.contentWrapper}>
        <Text style={styles.mainTitle}>Alliance Project Group</Text>

        <View style={styles.headerRow}>
          <Text style={styles.projectsTitle}>Projects</Text>
          <View style={styles.dropdownWrapper}>
            <View style={styles.dropdownContainer} ref={dropdownRef}>
              <TouchableOpacity
                style={[
                  styles.dropdownButton,
                  dropdownOpen && styles.dropdownButtonOpen,
                ]}
                onPress={toggleDropdown}
                activeOpacity={0.7}
              >
                <Text
                  style={styles.dropdownText}
                >
                  {statusOptions.find(opt => opt.value === selectedStatus)?.label}
                </Text>
                <View style={styles.curvedLine} />
                <Ionicons
                  name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#1d9b20"
                  style={styles.dropdownIcon}
                />
              </TouchableOpacity>
              {dropdownOpen && (
                <View style={styles.dropdownOptions}>
                  {statusOptions.map((option, index) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionItem,
                        selectedStatus === option.value &&
                          styles.selectedOption,
                        index === statusOptions.length - 1 &&
                          styles.lastOptionItem,
                      ]}
                      onPress={() => handleStatusSelect(option.value)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedStatus === option.value &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            {dropdownOpen && (
              <TouchableOpacity
                style={styles.dropdownBackdrop}
                onPress={() => setDropdownOpen(false)}
                activeOpacity={1}
              />
            )}
          </View>
        </View>

        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            {`${statusOptions.find(opt => opt.value === selectedStatus)?.label} Projects`}
          </Text>
        </View>

        <View style={styles.searchContainerWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#555" />
            <TextInput
              placeholder="Search"
              style={styles.input}
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {filteredData.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No projects found</Text>
            <Text style={styles.noDataSubText}>Try adjusting your search terms</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: hp('10%'), 
            }}
            style={{ flex: 1 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  curvedLine: {
    width: wp('0.8%'),
    height: hp('2%'),
    backgroundColor: 'transparent',
    borderLeftWidth: 1.5,
    borderLeftColor: '#1d9b20',
    borderTopLeftRadius: wp('2%'),
    borderBottomLeftRadius: wp('2%'),
    marginRight: wp('1%'),
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentWrapper: {
    flex: 1,
    padding: wp('5%'),
  },
  mainTitle: {
    fontSize: hp(2.5),
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: hp('1%'),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
    marginTop: hp('1%'),
    gap: hp('5%'),
  },
  projectsTitle: {
    fontSize: hp(2.2),
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  dropdownWrapper: {
    position: 'relative',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
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
    borderColor: '#D3D3D3',
    backgroundColor: '#f0f8f0',
  },
  dropdownText: {
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  dropdownIcon: {
    marginLeft: wp('2%'),
  },
  dropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    borderWidth: 1.5,
    borderColor: '#D3D3D3',
    marginTop: hp('0.8%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 1001,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
  selectedOption: {
    backgroundColor: '#f0f8f0',
  },
  optionText: {
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  selectedOptionText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#1d9b20',
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  subtitleContainer: {
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: hp(2),
    fontFamily: 'Poppins-SemiBold',
    color: '#555',
    marginHorizontal: wp('1%'),
  },
  searchContainerWrapper: {
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('88%'),
    borderRadius: wp('3%'),
    backgroundColor: '#f0f0f0',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.6%'),
  },
  input: {
    flex: 1,
    marginLeft: wp('2%'),
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  flatListContent: { paddingBottom: hp('2%') },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginBottom: hp('1%'),
    borderWidth: 0.2,
  },
  projectTitle: {
    fontSize: hp(2.2),
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: hp('1%'),
  },
  projectAddress: {
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Regular',
    color: '#666',
    marginBottom: hp('0.5%'),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: hp(2),
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('10%'),
  },
  noDataText: {
    fontSize: hp(2.2),
    fontFamily: 'Poppins-SemiBold',
    color: '#666',
    marginBottom: hp('1%'),
  },
  noDataSubText: {
    fontSize: hp(1.8),
    fontFamily: 'Poppins-Regular',
    color: '#999',
    textAlign: 'center',
  },
});