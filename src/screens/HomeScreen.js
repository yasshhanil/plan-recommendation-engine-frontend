import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList, SafeAreaView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Compass, Shuffle, MapPin, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, radius, fontSize } from '../theme/constants';
import { useTheme } from '../theme/useTheme';
import { moodOptions, placeOptions, constraintOptions, priceOptions } from '../utils/dummyData';
import { usePlanStore } from '../store/usePlanStore';
import { useAuthStore } from '../store/useAuthStore';
import { getCities, getPlans, setUserCity } from '../services/api';
import { persistAuth } from '../services/authService';

const fetchPlans = async () => {
  const response = await getPlans();
  if (!response.success) throw new Error('Failed to load plans');
  return response.plans;
};

const flagEmoji = (code) =>
  String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

export const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { setPlanningState, selectedCity, setSelectedCity, selectedArea, setSelectedArea } = usePlanStore();
  const { user, token, setAuth } = useAuthStore();
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState('cities');
  const [pendingCity, setPendingCity] = useState(null);
  const [cities, setCities] = useState([]);
  const { data: recentPlans = [] } = useQuery({
    queryKey: ['saved-plans'],
    queryFn: fetchPlans,
  });

useEffect(() => {
    getCities()
      .then((data) => { if (data.success) setCities(data.cities); })
      .catch(() => {});
  }, []);

  // For logged-in users, default to their last-chosen city once cities have loaded
  useEffect(() => {
    if (selectedCity || !user?.city || cities.length === 0) return;
    const match = cities.find((c) => c.name === user.city);
    if (match) setSelectedCity(match);
  }, [user?.city, cities, selectedCity]);

  const citiesByCountry = cities.reduce((acc, city) => {
    if (!acc[city.country]) acc[city.country] = { code: city.country_code, cities: [] };
    acc[city.country].cities.push(city);
    return acc;
  }, {});

  const countryEntries = Object.entries(citiesByCountry);

  const openModal = () => { setModalStep('cities'); setPendingCity(null); setCityModalVisible(true); };

  const rememberCity = async (city) => {
    if (!user || !city?.name || user.city === city.name) return;
    try {
      await setUserCity(city.name);
      const updatedUser = { ...user, city: city.name };
      setAuth(updatedUser, token);
      await persistAuth(token, updatedUser);
    } catch {}
  };

  const handleCityPress = (city) => {
    if (city.areas && city.areas.length > 0) {
      setPendingCity(city);
      setModalStep('areas');
    } else {
      setSelectedCity(city);
      setSelectedArea(null);
      setCityModalVisible(false);
      rememberCity(city);
    }
  };

  const handleAreaPress = (area) => {
    setSelectedCity(pendingCity);
    setSelectedArea(area);
    setCityModalVisible(false);
    rememberCity(pendingCity);
  };

  const handleRandomArea = () => {
    setSelectedCity(pendingCity);
    setSelectedArea(null);
    setCityModalVisible(false);
    rememberCity(pendingCity);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const pickRandom = (arr, count) =>
    [...arr].sort(() => Math.random() - 0.5).slice(0, count).map((o) => o.id);

  const requireLocation = () => {
    if (!selectedCity) {
      openModal();
      return false;
    }
    return true;
  };

  const handleQuickGenerate = () => {
    if (!requireLocation()) return;
    setPlanningState('selectedVibeTags', pickRandom(moodOptions, 2));
    setPlanningState('selectedCategoryTags', pickRandom(placeOptions, 2));
    setPlanningState('selectedPriceTags', pickRandom(priceOptions, 1)[0]);
    setPlanningState('selectedSpecialTags', pickRandom(constraintOptions, 1));
    navigation.navigate('Loading');
  };

  const cityLabel = () => {
    if (!selectedCity) return 'Set your location';
    const flag = flagEmoji(selectedCity.country_code);
    if (selectedArea) return `${flag} ${selectedCity.name} · ${selectedArea.name}`;
    return `${flag} ${selectedCity.name}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.mainBackground }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>

        {/* Header */}
        <View style={{ paddingHorizontal: spacing.xl, paddingTop: 64, marginBottom: spacing.xl }}>
          <Text style={{ fontSize: fontSize.metadata, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: spacing.xs }}>
            {getGreeting()}
          </Text>
          <Text style={{ fontSize: fontSize.hero, fontWeight: '800', color: colors.textPrimary, lineHeight: 42 }}>
            What's{'\n'}the move?
          </Text>
        </View>

        {/* Location */}
        <TouchableOpacity
          onPress={openModal}
          activeOpacity={0.75}
          style={{
            marginHorizontal: spacing.xl,
            marginBottom: spacing.xl,
            backgroundColor: colors.cardSurface,
            borderRadius: radius.card,
            padding: spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            borderWidth: !selectedCity ? 1.5 : 0,
            borderColor: colors.primaryAccent,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View style={{
            width: 42, height: 42, borderRadius: 21,
            backgroundColor: colors.primaryAccent + '22',
            justifyContent: 'center', alignItems: 'center',
          }}>
            <MapPin size={20} color={colors.primaryAccent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 }}>
              Location
            </Text>
            <Text style={{ fontSize: fontSize.body, fontWeight: '600', color: selectedCity ? colors.textPrimary : colors.primaryAccent }}>
              {cityLabel()}
            </Text>
          </View>
          <ChevronDown size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Action Cards */}
        <View style={{ gap: spacing.md, paddingHorizontal: spacing.xl, marginBottom: spacing.xl }}>

          {/* Plan It */}
          <TouchableOpacity
            onPress={() => { if (requireLocation()) navigation.navigate('PlanningFlow'); }}
            activeOpacity={0.85}
            style={{ borderRadius: radius.card, overflow: 'hidden' }}
          >
            <LinearGradient
              colors={[colors.primaryAccent, colors.secondaryAccent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}
            >
              <View style={{
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: 'rgba(0,0,0,0.15)',
                justifyContent: 'center', alignItems: 'center',
              }}>
                <Compass size={22} color={colors.mainBackground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: fontSize.cardTitle, fontWeight: '800', color: colors.mainBackground, marginBottom: 4 }}>
                  Plan It
                </Text>
                <Text style={{ fontSize: fontSize.smallLabel, color: colors.mainBackground + 'BB', lineHeight: 18 }}>
                  Pick your vibe, we'll curate
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Surprise Me */}
          <TouchableOpacity
            onPress={handleQuickGenerate}
            activeOpacity={0.85}
            style={{
              backgroundColor: colors.cardSurface,
              borderRadius: radius.card,
              padding: spacing.lg,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.lg,
              borderWidth: 1.5,
              borderColor: colors.inputSurface,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: colors.primaryAccent + '20',
              justifyContent: 'center', alignItems: 'center',
            }}>
              <Shuffle size={22} color={colors.primaryAccent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: fontSize.cardTitle, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 }}>
                Surprise Me
              </Text>
              <Text style={{ fontSize: fontSize.smallLabel, color: colors.textSecondary, lineHeight: 18 }}>
                Random plan, zero thinking
              </Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* Recent Plans */}
        {recentPlans.length > 0 && (
          <View style={{ paddingHorizontal: spacing.xl, marginBottom: spacing.xl }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
              <Text style={{ fontSize: fontSize.sectionHeading, fontWeight: '700', color: colors.textPrimary }}>
                Recent Plans
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('MainTabs', { screen: 'Saved' })}>
                <Text style={{ fontSize: fontSize.smallLabel, color: colors.primaryAccent, fontWeight: '600' }}>
                  See all
                </Text>
              </TouchableOpacity>
            </View>
            {recentPlans.slice(0, 2).map((plan) => (
              <TouchableOpacity
                key={plan.id}
                onPress={() => navigation.navigate('PlanDetail', { plan })}
                activeOpacity={0.85}
                style={{
                  backgroundColor: colors.cardSurface,
                  borderRadius: radius.card,
                  padding: spacing.lg,
                  marginBottom: spacing.sm,
                  borderWidth: 1,
                  borderColor: colors.inputSurface,
                }}
              >
                <Text style={{ fontSize: fontSize.body, fontWeight: '600', color: colors.textPrimary }} numberOfLines={1}>
                  {plan.description || (Array.isArray(plan.area) ? plan.area.join(', ') : plan.area) || 'Untitled Plan'}
                </Text>
                <Text style={{ fontSize: fontSize.smallLabel, color: colors.textMuted, marginTop: 4 }}>
                  {plan.created_at ? new Date(plan.created_at).toLocaleDateString() : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>

      {/* City / Area Picker Modal */}
      <Modal visible={cityModalVisible} transparent animationType="slide" onRequestClose={() => setCityModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <SafeAreaView style={{ backgroundColor: colors.mainBackground, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' }}>

            <View style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md,
              borderBottomWidth: 1, borderBottomColor: colors.inputSurface,
            }}>
              {modalStep === 'areas' ? (
                <TouchableOpacity onPress={() => setModalStep('cities')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <ChevronLeft size={18} color={colors.primaryAccent} />
                  <Text style={{ fontSize: fontSize.sectionHeading, fontWeight: '700', color: colors.textPrimary }}>
                    {pendingCity?.name}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ fontSize: fontSize.sectionHeading, fontWeight: '700', color: colors.textPrimary }}>
                  Choose a city
                </Text>
              )}
              <TouchableOpacity onPress={() => setCityModalVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {modalStep === 'cities' && (
              <FlatList
                data={countryEntries}
                keyExtractor={([country]) => country}
                contentContainerStyle={{ paddingBottom: spacing.xl }}
                renderItem={({ item: [country, { code, cities: countryCities }] }) => (
                  <View>
                    <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {flagEmoji(code)}{'  '}{country}
                      </Text>
                    </View>
                    {countryCities.map((city) => {
                      const isSelected = selectedCity?.id === city.id;
                      return (
                        <TouchableOpacity
                          key={city.id}
                          onPress={() => handleCityPress(city)}
                          activeOpacity={0.7}
                          style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                            paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
                            backgroundColor: isSelected ? colors.primaryAccent + '15' : 'transparent',
                          }}
                        >
                          <Text style={{ fontSize: fontSize.body, fontWeight: isSelected ? '700' : '400', color: isSelected ? colors.primaryAccent : colors.textPrimary }}>
                            {city.name}
                          </Text>
                          <ChevronRight size={16} color={colors.textMuted} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              />
            )}

            {modalStep === 'areas' && (
              <FlatList
                data={pendingCity?.areas || []}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{ paddingBottom: spacing.xl }}
                ListHeaderComponent={
                  <TouchableOpacity
                    onPress={handleRandomArea}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
                      paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
                      marginTop: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.inputSurface,
                    }}
                  >
                    <Shuffle size={16} color={colors.primaryAccent} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: fontSize.body, fontWeight: '600', color: colors.primaryAccent }}>
                        Random area
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                        Surprise me — pick from anywhere in {pendingCity?.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                }
                renderItem={({ item: area }) => {
                  const isSelected = selectedCity?.id === pendingCity?.id && selectedArea?.id === area.id;
                  return (
                    <TouchableOpacity
                      onPress={() => handleAreaPress(area)}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                        paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
                        backgroundColor: isSelected ? colors.primaryAccent + '15' : 'transparent',
                      }}
                    >
                      <Text style={{ fontSize: fontSize.body, fontWeight: isSelected ? '700' : '400', color: isSelected ? colors.primaryAccent : colors.textPrimary }}>
                        {area.name}
                      </Text>
                      {isSelected && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primaryAccent }} />}
                    </TouchableOpacity>
                  );
                }}
              />
            )}

          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};
