/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { Dispatch } from 'redux';
import { makeApi, CategoricalColorNamespace, t } from '@superset-ui/core';
import { isString } from 'lodash';
import { getClientErrorObject } from 'src/utils/getClientErrorObject';
import { addDangerToast } from 'src/components/MessageToasts/actions';
import {
  DashboardInfo,
  FilterBarLocation,
  RootState,
} from 'src/dashboard/types';
import { ChartConfiguration } from 'src/dashboard/reducers/types';
import { onSave } from './dashboardState';

export const DASHBOARD_INFO_UPDATED = 'DASHBOARD_INFO_UPDATED';

export function updateColorSchema(
  metadata: Record<string, any>,
  labelColors: Record<string, string>,
) {
  const categoricalNamespace = CategoricalColorNamespace.getNamespace(
    metadata?.color_namespace,
  );
  const colorMap = isString(labelColors)
    ? JSON.parse(labelColors)
    : labelColors;
  Object.keys(colorMap).forEach(label => {
    categoricalNamespace.setColor(label, colorMap[label]);
  });
}

// updates partially changed dashboard info
export function dashboardInfoChanged(newInfo: { metadata: any }) {
  const { metadata } = newInfo;

  const categoricalNamespace = CategoricalColorNamespace.getNamespace(
    metadata?.color_namespace,
  );

  categoricalNamespace.resetColors();

  if (metadata?.shared_label_colors) {
    updateColorSchema(metadata, metadata?.shared_label_colors);
  }

  if (metadata?.label_colors) {
    updateColorSchema(metadata, metadata?.label_colors);
  }

  return { type: DASHBOARD_INFO_UPDATED, newInfo };
}
export const SET_CHART_CONFIG_BEGIN = 'SET_CHART_CONFIG_BEGIN';
export interface SetChartConfigBegin {
  type: typeof SET_CHART_CONFIG_BEGIN;
  chartConfiguration: ChartConfiguration;
}
export const SET_CHART_CONFIG_COMPLETE = 'SET_CHART_CONFIG_COMPLETE';
export interface SetChartConfigComplete {
  type: typeof SET_CHART_CONFIG_COMPLETE;
  chartConfiguration: ChartConfiguration;
}
export const SET_CHART_CONFIG_FAIL = 'SET_CHART_CONFIG_FAIL';
export interface SetChartConfigFail {
  type: typeof SET_CHART_CONFIG_FAIL;
  chartConfiguration: ChartConfiguration;
}
export const setChartConfiguration =
  (chartConfiguration: ChartConfiguration) =>
  async (dispatch: Dispatch, getState: () => any) => {
    dispatch({
      type: SET_CHART_CONFIG_BEGIN,
      chartConfiguration,
    });
    const { id, metadata } = getState().dashboardInfo;

    // TODO extract this out when makeApi supports url parameters
    const updateDashboard = makeApi<
      Partial<DashboardInfo>,
      { result: DashboardInfo }
    >({
      method: 'PUT',
      endpoint: `/api/v1/dashboard/${id}`,
    });

    try {
      const response = await updateDashboard({
        json_metadata: JSON.stringify({
          ...metadata,
          chart_configuration: chartConfiguration,
        }),
      });
      dispatch(
        dashboardInfoChanged({
          metadata: JSON.parse(response.result.json_metadata),
        }),
      );
      dispatch({
        type: SET_CHART_CONFIG_COMPLETE,
        chartConfiguration,
      });
    } catch (err) {
      dispatch({ type: SET_CHART_CONFIG_FAIL, chartConfiguration });
    }
  };

export const SET_FILTER_BAR_LOCATION = 'SET_FILTER_BAR_LOCATION';
export interface SetFilterBarLocation {
  type: typeof SET_FILTER_BAR_LOCATION;
  filterBarLocation: FilterBarLocation;
}
export function setFilterBarLocation(filterBarLocation: FilterBarLocation) {
  return { type: SET_FILTER_BAR_LOCATION, filterBarLocation };
}

export function saveFilterBarLocation(location: FilterBarLocation) {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const { id, metadata } = getState().dashboardInfo;
    const updateDashboard = makeApi<
      Partial<DashboardInfo>,
      { result: Partial<DashboardInfo>; last_modified_time: number }
    >({
      method: 'PUT',
      endpoint: `/api/v1/dashboard/${id}`,
    });
    try {
      const response = await updateDashboard({
        json_metadata: JSON.stringify({
          ...metadata,
          filter_bar_location: location,
        }),
      });
      const updatedDashboard = response.result;
      const lastModifiedTime = response.last_modified_time;
      if (updatedDashboard.json_metadata) {
        const metadata = JSON.parse(updatedDashboard.json_metadata);
        if (metadata.filter_bar_location) {
          dispatch(setFilterBarLocation(metadata.filter_bar_location));
        }
      }
      if (lastModifiedTime) {
        dispatch(onSave(lastModifiedTime));
      }
    } catch (errorObject) {
      const { error, message } = await getClientErrorObject(errorObject);
      let errorText = t('Sorry, an unknown error occurred.');

      if (error) {
        errorText = t(
          'Sorry, there was an error saving this dashboard: %s',
          error,
        );
      }
      if (typeof message === 'string' && message === 'Forbidden') {
        errorText = t('You do not have permission to edit this dashboard');
      }
      dispatch(addDangerToast(errorText));
      throw errorObject;
    }
  };
}
