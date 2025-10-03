import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../Components/Header';
import { baseUrl } from "../utils/Api";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from '@react-native-vector-icons/ionicons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function Home({navigation}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('${baseUrl}reports/main-dashboard');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result && result.data) {
        // Transform API data to match our app format with actual progress values
        const formattedData = result.data.map(item => ({
          id: item.id?.toString() || Math.random().toString(),
          title: item.name || 'Unnamed Project',
          image: item.profile_picture ? { uri: item.profile_picture } : require('../assets/images/house.jpg'),
          redProgress: item.last_week_productivity ? Math.min(Math.max(item.last_week_productivity, 0), 100) : 0, // Last week productivity (0-100)
          greenProgress: item.completion_percentage ? Math.min(Math.max(item.completion_percentage, 0), 100) : 0, // Completion percentage (0-100)
          company: item.industry?.name || 'Constructed',
          status: item.status
        }));
        
        setData(formattedData);
      } else {
        console.log('No data found in response');
        setData([]);
      }
    } catch (error) {
      console.error('API Error:', error);
      // Fallback to dummy data if API fails
      setData([
        {
          id: '1',
          title: 'Mays Hill Apartments',
          image: require('../assets/images/house.jpg'),
          redProgress: 90,
          greenProgress: 70,
          company: 'Constructed',
        },
        {
          id: '2',
          title: 'Park Sydney Stage 2',
          image: require('../assets/images/house.jpg'),
          redProgress: 80,
          greenProgress: 60,
          company: 'Company',
        },
        {
          id: '3',
          title: 'Oran Park Resi 3',
          image: require('../assets/images/house.jpg'),
          redProgress: 0,
          greenProgress: 5,
          company: 'Constructed',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter data based on search query
  const filteredData = data.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.leftContainer}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Image 
              source={item.image} 
              style={styles.image}
              resizeMode="cover"
              onError={(error) => console.log('Image loading error:', error.nativeEvent.error)}
            />
            <Text style={styles.projectTitle}>{item.title}</Text>
          </View>
          <Text style={styles.companyText}>
            {item.company}
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.legendContainer}>
            <View style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: 'green' }]} />
              <Text style={styles.legendText}>
                Completion: {item.greenProgress.toFixed(0)}%
              </Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: 'red' }]} />
              <Text style={styles.legendText}>
                Last Week Productivity: {item.redProgress.toFixed(0)}%
              </Text>
            </View>
          </View>
          <View style={styles.circularProgressContainer}>
            <AnimatedCircularProgress
              size={75}
              width={6}
              fill={item.redProgress}
              tintColor="red"
              backgroundColor="#e0e0e0"
              rotation={0}
            />
            <AnimatedCircularProgress
              size={60}
              width={7}
              fill={item.greenProgress}
              tintColor="green"
              backgroundColor="#e0e0e0"
              rotation={0}
              style={styles.innerProgress}
            >
              {() => (
                <Text style={styles.progressText}>
                  {item.greenProgress.toFixed(0)}%
                </Text>
              )}
            </AnimatedCircularProgress>
          </View>
        </View>
      </View>
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Header toggleDrawer={() => navigation.toggleDrawer()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading projects...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header toggleDrawer={() => navigation.toggleDrawer()} />
      
      <Image
        source={require('../assets/images/logos.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>Alliance Project Group</Text>
      
      <View style={styles.subcontainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#555" />
          <TextInput 
            placeholder="Search projects..." 
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </View>
      
      {filteredData.length === 0 && !loading ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No projects found</Text>
          <Text style={styles.noDataSubText}>Try adjusting your search terms</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No projects available</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  subcontainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: wp('2%'),
  },
  title: {
    fontSize: hp('2.5%'),
    fontWeight: '600',
    marginHorizontal: wp('8%'),
    marginBottom: hp('1%'),
    fontFamily: 'Poppins-SemiBold',
  },
  logo: {
    alignItems: 'center',
    height: hp('15%'),
    width: wp('80%'),
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: wp('5%'),
    marginTop: hp('1%'),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('85%'),
    borderRadius: wp('3%'),
    backgroundColor: '#D3D3D3',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.6%'),
  },
  input: {
    flex: 1,
    marginLeft: wp('2%'),
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: wp('3%'),
    marginVertical: hp('0.5%'),
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginHorizontal: wp('1%'),
  },
  leftContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: 8,
    marginRight: wp('2%'),
  },
  projectTitle: {
    fontSize: hp('1.9%'),
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
    flexWrap: 'wrap',
  },
  companyText: {
    fontSize: hp('1.5%'),
    color: '#1d9b20',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: wp('2%'),
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
  },
  legendContainer: {
    flex: 1,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('0.5%'),
  },
  dot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    marginRight: wp('2%'),
  },
  legendText: {
    fontSize: hp('1.6%'),
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  circularProgressContainer: {
    position: 'relative',
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerProgress: {
    position: 'absolute',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'green',
    fontFamily: 'Poppins-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: hp('2%'),
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
    fontSize: hp('2.2%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#666',
    marginBottom: hp('1%'),
  },
  noDataSubText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#999',
    textAlign: 'center',
  },
  flatListContent: {
    paddingHorizontal: wp('4%'),
    paddingBottom: hp('2%'),
  },
});