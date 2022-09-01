/*
 *  Copyright 2021 Collate
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { AxiosResponse } from 'axios';
import axiosClient from '.';
import { EventFilter, Filters } from '../generated/settings/settings';

const BASE_URL = '/settings';

export const getActivityFeedEventFilters = async () => {
  const response = await axiosClient.get<{
    config_type: string;
    config_value: EventFilter[];
  }>(`${BASE_URL}/activityFeedFilterSetting`);

  return response.data.config_value;
};

export const createOrUpdateActivityFeedEventFilter = async (
  entityType: string,
  payload: Filters[]
) => {
  const configOptions = {
    headers: { 'Content-type': 'application/json' },
  };
  const url = `${BASE_URL}/filter/${entityType}/add`;

  const response = await axiosClient.put<
    Filters[],
    AxiosResponse<{
      config_type: string;
      config_value: EventFilter[];
    }>
  >(url, payload, configOptions);

  return response.data.config_value;
};
