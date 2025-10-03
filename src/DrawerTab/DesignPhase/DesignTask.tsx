import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';

export default function DesignTask() {
  const navigation = useNavigation();

  // Updated sections data
  const sections = [
    {
      id: '1',
      title: 'Productivity',
      percentage: '7.83%',
      subtitle: 'Last Weeks Productivity',
      timestamp: 'As of Tuesday 20 May at 12:31 pm',
    },
    {
      id: '2',
      title: 'Completion',
      percentage: '69.28%',
      subtitle: '',
      timestamp: 'As of just now',
    },
  ];

  const designStages = [
    {
      id: '1',
      title: 'Design Preparation Stage',
      date: '04/03/25',
      progress: 'Progress',
      percentage: 30,
      color: '#4CAF50',
    },
    {
      id: '2',
      title: 'Design Development Stage',
      date: '19/05/25',
      progress: 'Progress',
      percentage: 55,
      color: '#4CAF50',
    },
    {
      id: '3',
      title: 'Detail Design (70%-100%)',
      date: '19/05/25',
      progress: 'Progress',
      percentage: 80,
      color: '#FF9800',
    },
    {
      id: '4',
      title: 'Issue For Construction (IFC)',
      date: '06/06/25',
      progress: 'Progress',
      percentage: 100,
      color: '#757575',
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        if (item.title === 'Design Development Stage') {
          navigation.navigate('DesignList', { project: item });
        }
      }}
    >
      <View style={[styles.leftBar, { backgroundColor: item.color }]} />
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {item.id}. {item.title}
          </Text>
        </View>
        <Text style={styles.date}>{item.date}</Text>

        {/* Progress Label */}
        <Text style={styles.progressLabel}>{item.progress}</Text>

        {/* Progress Bar + Percentage in same row */}
        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${item.percentage}%`, backgroundColor: item.color },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{item.percentage}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHorizontalItem = ({ item }) => (
  <View style={styles.cardContainer}>
    <View style={styles.horizontalCard}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.percentageContainer}>
        <Text style={styles.percentageText}>{item.percentage}</Text>
        {item.subtitle ? (
          <Text style={styles.updateText}>{item.subtitle}</Text>
        ) : null}
        <Text style={styles.updateTexts}>{item.timestamp}</Text>
      </View>
    </View>
  </View>
);

  // const renderHorizontalItem = ({ item }) => (
  //   <View style={styles.cardContainer}>
  //     <View style={styles.horizontalCard}>
  //       <Text style={styles.cardTitle}>{item.title}</Text>
  //       <View style={styles.percentageContainer}>
  //         <Text style={styles.percentageText}>{item.percentage}</Text>
  //         {item.subtitle ? (
  //           <Text style={styles.updateText}>{item.subtitle}</Text>
  //         ) : null}
  //         <Text style={styles.updateTexts}>{item.timestamp}</Text>
  //       </View>
  //     </View>
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <FlatList
        data={designStages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: wp('5%'), paddingBottom: wp('3%') }}
        ListHeaderComponent={
          <>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.pageTitle}>Oran Park Resi 3</Text>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Ionicons name="arrow-back" size={hp('2.8%')} color="#ffff" />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: hp('2.3%'),
                color: '#ADADAD',
                marginBottom: hp('0.1%'),
                fontFamily: 'Poppins-Italic',
              }}
            >
              Productivity-Matrix Design
            </Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={sections}
              renderItem={renderHorizontalItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.horizontalFlatListContent}
              style={[
                styles.horizontalFlatList,
                {
                  paddingBottom: wp('1%'),
                },
              ]}
            />
            <Text
              style={{
                fontSize: hp('2.2%'),
                fontWeight: 'bold',
                color: '#333',
                marginTop: 2,
                marginBottom: 4,
                fontFamily: 'Poppins-SemiBold',
                marginHorizontal: wp('2%'),
              }}
            >
              Design
            </Text>
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  percentageContainer: {
  alignItems: 'flex-start',
},
percentageText: {
  fontSize: hp('3%'),
  fontWeight: 'bold',
  color: '#1d9b20',
  textAlign: 'left',
},
updateText: {
  fontSize: hp('1.5%'),
  color: '#000',
  fontWeight: 'bold',
  marginTop: hp('0.5%'),
  textAlign: 'left', 
},
updateTexts: {
  fontSize: hp('1.3%'),
  color: '#666',
  marginTop: hp('0.5%'),
  textAlign: 'left',  // 👈 left align
},
  leftBar: {
    width: wp('9%'),
    borderRadius: wp('2%'),
    marginRight: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: wp('1%'),
    marginBottom: 12,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 40, 
    textAlign: 'right',
  },
  iconContainer: {
    backgroundColor: 'gray',
    padding: wp('1%'),
    borderRadius: wp('5%'),
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  pageTitle: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp('0.1%'),
  },
  horizontalFlatList: {
    marginVertical: hp('2%'),
  },
  horizontalFlatListContent: {
    paddingHorizontal: wp('2%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: wp('45%'),
    marginHorizontal: wp('3.5%'), 
  },
  horizontalCard: {
    padding: wp('1.5%'),
    borderRadius: 12,
    height: hp('18%'), 
  },
  cardTitle: {
    fontSize: hp('1.8%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('1%'),
    textAlign: 'left',
  },
});
