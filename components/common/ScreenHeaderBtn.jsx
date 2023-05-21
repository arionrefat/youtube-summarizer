import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  btnContainer: {
    padding: 10,
    backgroundColor: '#3f51b5',
    borderRadius: 4,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

const ScreenHeaderBtn = ({ name, handlePress }) => {
  return (
    <TouchableOpacity style={styles.btnContainer} onPress={handlePress}>
      <Text style={styles.btnText}>{name}</Text>
    </TouchableOpacity>
  );
};

export default ScreenHeaderBtn;
