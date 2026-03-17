import { gql } from '@apollo/client';

export const GENERATE_DEVICE_ID = gql`
  query Query {
    generateDeviceId
  }
`;
