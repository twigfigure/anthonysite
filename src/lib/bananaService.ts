import axios from 'axios';
import { cropWhiteSpace } from './imageUtils';

interface GeminiGenerateParams {
  prompt: string;
  apiKey: string;
  referenceImage?: string; // Base64 image data URL for breeding
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }>;
    };
  }>;
}

export async function generateImageWithBanana(
  params: GeminiGenerateParams
): Promise<string> {
  const { prompt, apiKey, referenceImage } = params;

  console.log('Starting image generation...', {
    hasApiKey: !!apiKey,
    hasReferenceImage: !!referenceImage,
    promptLength: prompt.length
  });

  try {
    // Note: gemini-2.5-flash-image is a text-to-image model and cannot accept images as input
    // For breeding, we enhance the text prompt instead of sending the reference image
    let enhancedPrompt = prompt;

    if (referenceImage) {
      // When breeding, add instructions to maintain similar style
      enhancedPrompt = "Create a variation of a previous design, maintaining similar style, color palette, and visual characteristics while incorporating these new traits:\n\n" + prompt;
    }

    console.log('Making API request with prompt:', enhancedPrompt.substring(0, 100) + '...');

    // Use Google's Gemini 2.5 Flash Image (nano banana)
    const response = await axios.post<GeminiResponse>(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
      {
        contents: [{
          parts: [{ text: enhancedPrompt }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
      }
    );

    console.log('API response received:', {
      status: response.status,
      hasCandidates: !!response.data.candidates,
      candidatesLength: response.data.candidates?.length
    });

    // Extract base64 image from response
    const parts = response.data.candidates?.[0]?.content?.parts;

    console.log('Parts array:', parts);

    // Look for inlineData in any of the parts
    let imageData = null;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          imageData = part.inlineData;
          break;
        }
      }
    }

    console.log('Extracted image data:', {
      hasImageData: !!imageData,
      hasData: !!imageData?.data,
      mimeType: imageData?.mimeType,
      dataLength: imageData?.data?.length
    });

    if (imageData?.data) {
      const mimeType = imageData.mimeType || 'image/png';
      console.log('Successfully extracted image, cropping white space...');
      const dataUrl = `data:${mimeType};base64,${imageData.data}`;

      try {
        const croppedDataUrl = await cropWhiteSpace(dataUrl);
        console.log('Image cropped successfully');
        return croppedDataUrl;
      } catch (error) {
        console.error('Failed to crop image, returning original:', error);
        return dataUrl;
      }
    }

    // Log the full response for debugging
    console.error('Unexpected API response structure:', JSON.stringify(response.data, null, 2));

    throw new Error('No image returned from Google Gemini');
  } catch (error: any) {
    console.error('Google Gemini API error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      fullError: error
    });

    if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.error?.message || 'Invalid request';
      throw new Error(`API Error: ${errorMsg}`);
    } else if (error.response?.status === 403) {
      throw new Error('API key invalid or Imagen API not enabled.');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    } else if (error.response?.status === 503) {
      throw new Error('Google Imagen API is temporarily unavailable. Please try again in a few moments.');
    } else if (error.response?.status >= 500) {
      throw new Error('Google Imagen API is experiencing issues. Please try again later.');
    }

    throw new Error('Failed to generate image with Google Gemini');
  }
}
