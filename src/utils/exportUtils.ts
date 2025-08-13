import { Challenge, CommitmentLetter } from '../types';

export const generateCommitmentLetter = (challenge: Challenge, witnessName?: string): CommitmentLetter => {
  const content = `
PERSONAL COMMITMENT LETTER

Challenge: ${challenge.name}
Duration: ${challenge.totalDays} days
Start Date: ${new Date(challenge.startDate).toLocaleDateString()}
End Date: ${new Date(challenge.endDate).toLocaleDateString()}

I, the undersigned, hereby commit to completing the "${challenge.name}" challenge for the next ${challenge.totalDays} consecutive days.

COMMITMENT RULES:
${challenge.rules.map((rule, index) => `${index + 1}. ${rule}`).join('\n')}

I acknowledge that this commitment is a promise to myself for personal growth and development. I understand that consistency and dedication are key to achieving my goals.

I will track my progress daily and maintain accountability through:
- Daily task completion
- Regular progress reviews
- Video reflections when applicable
- Honest self-assessment

By signing this commitment, I pledge to give my best effort and maintain integrity throughout this challenge period.

Signed: _________________________
Date: ${new Date().toLocaleDateString()}

${witnessName ? `Witness: ${witnessName}\nWitness Signature: _________________________` : ''}

"The journey of a thousand miles begins with one step." - Lao Tzu
  `.trim();

  return {
    id: `commitment-${challenge.id}`,
    challengeId: challenge.id,
    content,
    signedDate: new Date().toISOString(),
    witnessName,
  };
};

export const downloadCommitmentLetter = (commitmentLetter: CommitmentLetter, challengeName: string) => {
  const blob = new Blob([commitmentLetter.content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${challengeName.replace(/\s+/g, '_')}_Commitment_Letter.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportChallengeData = (challenge: Challenge, progress: any[], reflections: any[]) => {
  const data = {
    challenge,
    progress,
    reflections,
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${challenge.name.replace(/\s+/g, '_')}_Data_Export.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};