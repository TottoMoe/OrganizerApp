import { gql } from "@apollo/client";

export const ADD_PROFILE = gql`
  mutation addProfile($name: String!, $email: String!, $password: String!) {
    addProfile(name: $name, email: $email, password: $password) {
      token
      profile {
        _id
        name
      }
    }
  }
`;

export const ADD_EVENT = gql`
  mutation addEvent($profileId: ID!, $event: String!) {
    addEvent(profileId: $profileId, event: $event) {
      _id
      name
      events
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      profile {
        _id
        name
      }
    }
  }
`;

export const REMOVE_EVENT = gql`
  mutation removeEvent($event: String!) {
    removeEventevent: $event) {
      _id
      name
      events
    }
  }
`;
