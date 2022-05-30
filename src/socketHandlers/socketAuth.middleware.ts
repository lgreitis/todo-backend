import { User } from '@models/user';
import { authService } from '@services/auth.service';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  try {
    const token = socket.request.headers['bearer'] as string;
    const id = authService.verifyToken(token).id;
    const user = await User.findById(id);
    socket.data = { user };
    next();
  } catch (err) {
    next();
  }
};
