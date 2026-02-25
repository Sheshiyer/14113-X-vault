import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { updateProfileSchema } from "@/lib/validations";

/**
 * GET /api/user/profile
 * 
 * Get the current authenticated user's profile.
 * Returns user details including biorhythm profile if set.
 * 
 * @response { user: UserProfile }
 * 
 * @example
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "user": {
 *       "id": "user_12345",
 *       "email": "user@example.com",
 *       "name": "John Doe",
 *       "birthDate": "1990-05-15",
 *       "timezone": "America/New_York",
 *       "image": "https://example.com/avatar.jpg",
 *       "preferences": {
 *         "notifications": true,
 *         "theme": "dark"
 *       },
 *       "joinedAt": "2024-01-10T08:00:00Z",
 *       "lastActive": "2024-01-20T15:30:00Z"
 *     },
 *     "hasBirthDate": true,
 *     "isProfileComplete": true
 *   }
 * }
 */

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  birthDate?: string;
  timezone?: string;
  image?: string;
  preferences?: Record<string, unknown>;
  joinedAt?: string;
  lastActive?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "AUTH_REQUIRED",
            message: "Authentication required to access profile",
          },
        },
        { status: 401 }
      );
    }

    // Build user profile from session
    // In a real implementation, this would fetch from database
    const userProfile: UserProfile = {
      id: session.user.id,
      email: session.user.email || "",
      name: session.user.name || null,
      image: session.user.image || undefined,
      birthDate: session.user.birthdate,
      timezone: session.user.timezone || "UTC",
      preferences: {
        notifications: true,
        theme: "system",
      },
      joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Mock: 30 days ago
      lastActive: new Date().toISOString(),
    };

    // Check profile completeness
    const hasBirthDate = !!userProfile.birthDate;
    const isProfileComplete = hasBirthDate && !!userProfile.name && !!userProfile.timezone;

    return NextResponse.json(
      {
        success: true,
        data: {
          user: userProfile,
          hasBirthDate,
          isProfileComplete,
          onboardingComplete: isProfileComplete,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile get error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SYS_INTERNAL_ERROR",
          message: "An internal error occurred while fetching profile",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/profile
 * 
 * Update the current user's profile.
 * Supports partial updates - only provided fields are updated.
 * 
 * @requestBody { name?: string, birthDate?: string, timezone?: string }
 * @response { user: UpdatedUserProfile }
 * 
 * @example
 * Request:
 * {
 *   "name": "Jane Doe",
 *   "birthDate": "1992-08-20",
 *   "timezone": "America/Los_Angeles"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "user": {
 *       "id": "user_12345",
 *       "email": "user@example.com",
 *       "name": "Jane Doe",
 *       "birthDate": "1992-08-20",
 *       "timezone": "America/Los_Angeles",
 *       "updatedAt": "2024-01-20T10:30:00Z"
 *     },
 *     "updated": ["name", "birthDate", "timezone"],
 *     "isProfileComplete": true
 *   }
 * }
 */

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "AUTH_REQUIRED",
            message: "Authentication required to update profile",
          },
        },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VAL_INVALID_INPUT",
            message: "Validation failed",
            details: validationResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    const { name, birthDate, timezone } = validationResult.data;

    // Track which fields were updated
    const updatedFields: string[] = [];

    // Validate timezone if provided
    if (timezone) {
      try {
        // Test if timezone is valid
        Intl.DateTimeFormat(undefined, { timeZone: timezone });
        updatedFields.push("timezone");
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VAL_INVALID_TIMEZONE",
              message: `Invalid timezone: "${timezone}"`,
            },
          },
          { status: 400 }
        );
      }
    }

    // Validate birth date if provided
    if (birthDate) {
      const birthDateObj = new Date(birthDate);
      const now = new Date();

      if (isNaN(birthDateObj.getTime())) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VAL_INVALID_DATE",
              message: "Invalid birth date format",
            },
          },
          { status: 400 }
        );
      }

      if (birthDateObj > now) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VAL_INVALID_DATE",
              message: "Birth date cannot be in the future",
            },
          },
          { status: 400 }
        );
      }

      // Check if user would be older than 150 years
      const maxAge = 150;
      const minBirthDate = new Date(now.getFullYear() - maxAge, now.getMonth(), now.getDate());

      if (birthDateObj < minBirthDate) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VAL_INVALID_DATE",
              message: `Birth date is too far in the past (max age: ${maxAge} years)`,
            },
          },
          { status: 400 }
        );
      }

      updatedFields.push("birthDate");
    }

    if (name !== undefined) {
      updatedFields.push("name");
    }

    // In a real implementation, this would update the database
    // For now, build the updated profile
    const updatedProfile: UserProfile = {
      id: session.user.id,
      email: session.user.email || "",
      name: name !== undefined ? name : session.user.name || null,
      image: session.user.image || undefined,
      birthDate: birthDate !== undefined ? birthDate : session.user.birthdate,
      timezone: timezone !== undefined ? timezone : session.user.timezone || "UTC",
      preferences: {
        notifications: true,
        theme: "system",
      },
      joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date().toISOString(),
    };

    // Check profile completeness after update
    const hasBirthDate = !!updatedProfile.birthDate;
    const isProfileComplete = hasBirthDate && !!updatedProfile.name && !!updatedProfile.timezone;

    return NextResponse.json(
      {
        success: true,
        data: {
          user: updatedProfile,
          updated: updatedFields,
          isProfileComplete,
          onboardingComplete: isProfileComplete,
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SYS_INTERNAL_ERROR",
          message: "An internal error occurred while updating profile",
        },
      },
      { status: 500 }
    );
  }
}
