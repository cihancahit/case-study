import { nanoid } from 'nanoid';

import { accountRepo } from '../repositories/accountRepo.js';
import { lessonRepo } from '../repositories/lessonRepo.js';
import { assigmentRepo } from '../repositories/assigmentRepo.js';
import { NotificationService } from './NotificationService.js';
import { E } from '../utils/appError.js';

function nowIsoString() {
  return new Date().toISOString();
}

export const MatchingService = {
  matchRequest({ requestId, requesterUserId }) {
    const reqObj = lessonRepo.findRequestById(requestId);
    if (!reqObj) throw E.notFound('REQUEST_NOT_FOUND', 'Lesson request not found');

    if (reqObj.userId === requesterUserId) {
      throw E.badRequest('INVALID_MATCH', 'Cannot match own lesson request');
    }

    if (reqObj.status !== 'OPEN') {
      throw E.badRequest('INVALID_REQUEST_STATUS', 'Lesson request is not open for matching');
    }

    const instructors = accountRepo.listByRole('instructor');
    if (instructors.length === 0) {
      throw E.conflict('NO_INSTRUCTORS_AVAILABLE', 'No instructors available for matching');
    }
    const chosen = instructors.find((ins) => {
      const active = assigmentRepo.listActiveByInstructorId(ins.id);
      return active.length === 0;
    });
    if (!chosen) {
      throw E.conflict('NO_INSTRUCTORS_AVAILABLE', 'No instructors available for matching');
    }

    const assignment = assigmentRepo.createAssignement({
      id: nanoid(),
      requestId: reqObj.id,
      instructorId: chosen.id,
      status: 'ASSIGNED',
      createdAt: nowIsoString(),
      updatedAt: nowIsoString(),
    });

    lessonRepo.updateRequeststatus(reqObj.id, 'ASSIGNED');

    NotificationService.sendNotification(chosen.id, 'LESSON_ASSIGNED', {
      assignmentId: assignment.id,
      requestId: reqObj.id,
      userId: reqObj.userId,
    });
    return { assignment, instructorId: chosen.id };
  },
  acceptAssignment({ instructorId, assignmentId }) {
    const assignment = assigmentRepo.findById(assignmentId);
    if (!assignment) throw E.notFound('ASSIGNMENT_NOT_FOUND', 'Assignment not found');
    if (assignment.instructorId !== instructorId) {
      throw E.forbidden('UNAUTHORIZED', 'You are not authorized to accept this assignment');
    }
    if (assignment.status !== 'ASSIGNED') {
      throw E.badRequest(
        'INVALID_ASSIGNMENT_STATUS',
        'Assignment is not in a valid state to be accepted'
      );
    }

    assigmentRepo.updateStatus(assignment.id, 'ACCEPTED');
    lessonRepo.updateRequestStatus(assignment.requestId, 'CONFIRMED');

    return { assignment: assigmentRepo.findById(assignment.id) };
  },
  rejectAssignment({ instructorId, assignmentId }) {
    const assignment = assigmentRepo.findById(assignmentId);
    if (!assignment) throw E.notFound('ASSIGNMENT_NOT_FOUND', 'Assignment not found');
    if (assignment.instructorId !== instructorId) {
      throw E.forbidden('UNAUTHORIZED', 'You are not authorized to reject this assignment');
    }
    if (assignment.status !== 'ASSIGNED') {
      throw E.badRequest(
        'INVALID_ASSIGNMENT_STATUS',
        'Assignment is not in a valid state to be rejected'
      );
    }

    assigmentRepo.updateStatus(assignment.id, 'REJECTED');
    lessonRepo.updateRequestStatus(assignment.requestId, 'OPEN');

    return { assignment: assigmentRepo.findById(assignment.id) };
  },
};
