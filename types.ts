
import React from 'react';

export enum FeatureType {
  // Free Features
  SMART_QUESTION = 'SMART_QUESTION', // Education Problem Solver
  JSON_PROMPT_GENERATOR = 'JSON_PROMPT_GENERATOR',
  
  // Limited Features (12 Total)
  WEBSITE_BUILDER = 'WEBSITE_BUILDER',
  WEB_APP_BUILDER = 'WEB_APP_BUILDER',
  MOBILE_APP_BUILDER = 'MOBILE_APP_BUILDER',
  AI_AGENT_CREATOR = 'AI_AGENT_CREATOR',
  TEXT_TO_IMAGE = 'TEXT_TO_IMAGE',
  PHOTO_EDITING = 'PHOTO_EDITING',
  DESIGNER_TOOL = 'DESIGNER_TOOL',
  TOOL_CREATOR = 'TOOL_CREATOR',
  TEXT_TO_VIDEO = 'TEXT_TO_VIDEO',
  PHOTO_TO_VIDEO = 'PHOTO_TO_VIDEO',
  TEXT_TO_VOICE = 'TEXT_TO_VOICE',
  AI_VIDEO_GENERATOR = 'AI_VIDEO_GENERATOR'
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  credits: number;
  lastReset: number;
  plan: 'Free' | 'Pro';
}

export interface Feature {
  id: FeatureType;
  title: string;
  icon: React.ReactNode;
  category: 'FREE' | 'BUILDERS' | 'CREATIVE';
  description: string;
  isFree: boolean;
}
