import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextStyle } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

interface propTypes {
  openingTime?: string | null;
  closingTime?: string | null;
  onChangeOpenTime: React.Dispatch<React.SetStateAction<string | null>>;
  onChangeCloseTime: React.Dispatch<React.SetStateAction<string | null>>;
  error?: boolean;
  extraStyles?:TextStyle|TextStyle [] ;
}

const TimePickerScreen = ({
  openingTime,
  closingTime,
  onChangeOpenTime,
  onChangeCloseTime,
  error=false,
  extraStyles
}: propTypes) => {
  const [isOpenTimePickerVisible, setOpenTimePickerVisible] = useState(false);
  const [isCloseTimePickerVisible, setCloseTimePickerVisible] = useState(false);
  const [openTime, setOpenTime] = useState<string | null>(null);
  const [closeTime, setCloseTime] = useState<string | null>(null);

  useEffect(()=>{
    setOpenTime(openingTime||null);
    setCloseTime(closingTime||null)
  },[openingTime,closingTime])

  const handleOpenTime = (time: Date) => {
    const formattedTime = moment(time).format('hh:mm A');
    setOpenTime(formattedTime);
    onChangeOpenTime(formattedTime);
    setOpenTimePickerVisible(false);
  };

  const handleCloseTime = (time: Date) => {
    const formattedTime = moment(time).format('hh:mm A');
    setCloseTime(formattedTime);
    onChangeCloseTime(formattedTime);
    setCloseTimePickerVisible(false);
  };

  return (
    <View style={{ padding: 0 }}>
      <Text style={[{ fontSize: 18, fontWeight: '600', marginBottom: 10, color: error ? 'red' : 'black'},extraStyles]}>
        Shop Timings
      </Text>
      
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 12,
        }}
      >
        {/* Opening Time Picker */}
        <TouchableOpacity
          onPress={() => setOpenTimePickerVisible(true)}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 18,
            flex:1,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            minWidth: 100,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16 }}>{openTime ?? 'hh:mm'}</Text>
        </TouchableOpacity>

        {/* Dash Separator */}
        <Text style={{ fontSize: 18, fontWeight: '600' }}>-</Text>

        {/* Closing Time Picker */}
        <TouchableOpacity
          onPress={() => setCloseTimePickerVisible(true)}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 18,
            flex:1,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            minWidth: 100,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16 }}>{closeTime ?? 'hh:mm'}</Text>
        </TouchableOpacity>
      </View>

      {/* Time Pickers */}
      <DateTimePickerModal
        isVisible={isOpenTimePickerVisible}
        mode="time"
        onConfirm={handleOpenTime}
        onCancel={() => setOpenTimePickerVisible(false)}
        date={openTime ? moment(openTime, 'hh:mm A').toDate() : new Date()}
      />
      <DateTimePickerModal
        isVisible={isCloseTimePickerVisible}
        mode="time"
        onConfirm={handleCloseTime}
        onCancel={() => setCloseTimePickerVisible(false)}
        date={closeTime ? moment(closeTime, 'hh:mm A').toDate() : new Date()}
      />
    </View>
  );
};

export default TimePickerScreen;
