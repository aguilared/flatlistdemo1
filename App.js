import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import { Constants } from 'expo';
import moment from 'moment';
import 'moment-timezone';
var idLocale = require('moment/locale/es');

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 0,
      seed: 0,
      error: null,
      refreshing: false
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    //const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    const url = `http://34.229.201.249:1337/api/sucesos/list44?seed=${seed}&page=${page}&results=20`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderHeader = () => {
    return <SearchBar placeholder="Type Here..." lightTheme round />;
  };
  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    const date = new Date();
    const titulo = "Ultimos Sucesos al: " + moment(date).format("LLL") + ", Homicidios Ciudad Guayana este mes: " + this.state.tmes + ", año= " + this.state.totalAcuAno;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{titulo}</Text>  
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <ListItem
                roundAvatar
                title={`${item.suceso_id} ${moment(item.fecha_suceso).format("LLL")}`}
                subtitle={item.titulo}
                avatar={{ uri: item.url_img }}
                containerStyle={{ borderBottomWidth: 0 }}
              />
            )}
            keyExtractor={item => item.email}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={8}
            onEndThreshold={8}
          />
        </List>
      </View>
    );
  }
}  




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#E30412',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'space-between',
    marginVertical: 3
  },
  title: {
    fontSize: 14,
    backgroundColor: 'transparent',
    color: 'white',
  },
})