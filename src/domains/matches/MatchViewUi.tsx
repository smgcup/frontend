import React from 'react';
import MobilePageHeader from '@/components/MobilePageHeader/MobilePageHeader';
import { matchIcon } from '@/public/icons';

const MatchViewUi = () => {
	return (
		<>
			<MobilePageHeader
				title="All Matches"
				description="Complete schedule and results of all tournament matches"
				icon={matchIcon}
			/>
		</>
	);
};

export default MatchViewUi;
