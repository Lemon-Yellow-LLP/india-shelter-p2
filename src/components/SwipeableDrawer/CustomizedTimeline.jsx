import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import ApplicantIcon from '../../assets/icons/applicant.svg';
import BankIcon from '../../assets/icons/bank.svg';
import Lnt from '../../assets/icons/lnt.svg';
import Location from '../../assets/icons/location.svg';
import PersonalDetails from '../../assets/icons/personalDetails.svg';
import Property from '../../assets/icons/propertyDetails.svg';
import Reference from '../../assets/icons/reference.svg';
import Upload from '../../assets/icons/upload.svg';

export default function CustomizedTimeline() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <TimelineItem>
        <TimelineSeparator>
          <img style={{ maxWidth: '16px', maxHeight: '16px' }} src={ApplicantIcon} />
          <TimelineConnector />
        </TimelineSeparator>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <img style={{ maxWidth: '16px', maxHeight: '16px' }} src={PersonalDetails} />
          <TimelineConnector />
        </TimelineSeparator>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <img style={{ maxWidth: '16px', maxHeight: '16px' }} src={PersonalDetails} />
          <TimelineConnector />
        </TimelineSeparator>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <img style={{ maxWidth: '16px', maxHeight: '16px' }} src={PersonalDetails} />
          <TimelineConnector />
        </TimelineSeparator>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <img style={{ maxWidth: '16px', maxHeight: '16px' }} src={Property} />
          <TimelineConnector />
        </TimelineSeparator>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <img style={{ maxWidth: '16px', maxHeight: '16px' }} src={BankIcon} />
          <TimelineConnector />
        </TimelineSeparator>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <img style={{ maxWidth: '16px', maxHeight: '16px' }} src={Reference} />
          <TimelineConnector />
        </TimelineSeparator>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <img style={{ maxWidth: '16px', maxHeight: '16px' }} src={Upload} />
          <TimelineConnector />
        </TimelineSeparator>
      </TimelineItem>
      <TimelineItem>
        <img style={{ maxWidth: '16px', maxHeight: '16px' }} src={Lnt} />
      </TimelineItem>
    </div>
  );
}
