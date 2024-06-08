import {
  ITemplate,
  ITemplateRequest,
  ITemplateUpdate,
} from '@packages/entities/index.browser';
import { ApiService } from '@root/services/apiclient';

const apiClient = new ApiService();

/**
 * @summary Get Templates by PracticeId
 * @param payloadData
 * @param param1
 * @returns template object as a response
 */
export const getTemplates = async (
  payloadData: {
    practiceId: string;
    userId?: string;
  },
  { rejectWithValue },
): Promise<ITemplate[]> => {
  try {
    const response: Response = await apiClient.get(
      `/practices/${payloadData.practiceId}/users/${payloadData.userId}/templates`,
    );
    if (!response.ok) {
      throw new Error('Failed to get templates');
    }
    const data = await response.json();

    const modifiedDataObject = {};
    data.forEach((element: ITemplate) => {
      const surgeryConfiguration: string = element.surgeryConfiguration.name;
      const messageType: string = element.messageType;
      if (modifiedDataObject[surgeryConfiguration]) {
        if (modifiedDataObject[surgeryConfiguration][messageType]) {
          modifiedDataObject[surgeryConfiguration][messageType].push(element);
        } else {
          modifiedDataObject[surgeryConfiguration][messageType] = [element];
        }
      } else {
        modifiedDataObject[surgeryConfiguration] = {
          [messageType]: [element],
          surgeryConfigurationName: surgeryConfiguration,
        };
      }
    });

    return Object.values(modifiedDataObject);
  } catch (error) {
    return rejectWithValue(error);
  }
};

/**
 * @summary Add template for a practice
 * @param payloadData
 * @param param1
 * @returns ITemplate
 */
export const addTemplate = async (
  payloadData: ITemplateRequest,
  { rejectWithValue },
): Promise<ITemplate> => {
  try {
    const response: Response = await apiClient.post(
      `/practices/${payloadData.practiceId}/users/${payloadData.userId}/templates`,
      payloadData,
    );

    if (!response.ok) {
      throw new Error('Failed to add template');
    }
    const data: ITemplate = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

/**
 * @summary Update template
 * @param payloadData
 * @param param1
 * @returns  template object as a response
 */
export const updateTemplate = async (
  payloadData: ITemplateUpdate,
  { rejectWithValue },
) => {
  try {
    const { practiceId, userId, id, ...restPayload } = payloadData;
    const sanitizedPayload = { ...restPayload };
    const response = await apiClient.patch(
      `/practices/${practiceId}/users/${userId}/templates/${id}`,
      sanitizedPayload,
    );
    if (!response.ok) {
      throw new Error('Failed to update template');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};

export const deleteTemplate = async (
  payloadData: {
    practiceId: string;
    id: string;
    userId: string;
  },
  { rejectWithValue },
) => {
  try {
    const response = await apiClient.delete(
      `/practices/${payloadData.practiceId}/users/${payloadData.userId}/templates/${payloadData.id}`,
      null,
    );
    if (!response.ok) {
      throw new Error('Failed to delete template');
    }
    const responseData = await response.text();

    if (!responseData.trim()) {
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('An unknown error occurred');
  }
};
