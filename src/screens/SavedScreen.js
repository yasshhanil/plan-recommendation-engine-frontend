import React from 'react';
import { View, Text } from 'react-native';
import { colors, spacing, fontSize } from '../theme/constants';
import { commonStyles } from '../styles/common';
import { useNavigation } from '@react-navigation/native';

export const SavedScreen = () => {
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.navigate('SavedPlans');
  }, [navigation]);

  return (
    <View style={commonStyles.container}>
      <View style={[commonStyles.paddingXL, commonStyles.justifyContentCenter, commonStyles.alignItemsCenter, { flex: 1 }]}>
        <Text style={commonStyles.mainHeading}>
          Saved Plans
        </Text>
      </View>
    </View>
  );
};
