import cron from 'node-cron';
import { User } from '../../db/models/user.model.js';

// Schedule the job to run every 6 hours
cron.schedule('0 */6 * * *', async () => {
  try {
    console.log('Running cleanup job: Deleting expired OTPs...');

    const now = new Date();
    const result = await User.updateMany(
      {},
      {
        $pull: {
          OTP: { expiresIn: { $lt: now } }
        }
      }
    );

    console.log(`Cleanup complete. Modified documents: ${result.modifiedCount}`);
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error);
  }
});