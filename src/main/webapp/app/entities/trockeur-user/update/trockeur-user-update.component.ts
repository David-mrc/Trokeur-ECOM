import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TrockeurUserFormService, TrockeurUserFormGroup } from './trockeur-user-form.service';
import { ITrockeurUser } from '../trockeur-user.model';
import { TrockeurUserService } from '../service/trockeur-user.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  standalone: true,
  selector: 'jhi-trockeur-user-update',
  templateUrl: './trockeur-user-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TrockeurUserUpdateComponent implements OnInit {
  isSaving = false;
  trockeurUser: ITrockeurUser | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: TrockeurUserFormGroup = this.trockeurUserFormService.createTrockeurUserFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected trockeurUserService: TrockeurUserService,
    protected trockeurUserFormService: TrockeurUserFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trockeurUser }) => {
      this.trockeurUser = trockeurUser;
      if (trockeurUser) {
        this.updateForm(trockeurUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('trokeurApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const trockeurUser = this.trockeurUserFormService.getTrockeurUser(this.editForm);
    if (trockeurUser.id !== null) {
      this.subscribeToSaveResponse(this.trockeurUserService.update(trockeurUser));
    } else {
      this.subscribeToSaveResponse(this.trockeurUserService.create(trockeurUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITrockeurUser>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(trockeurUser: ITrockeurUser): void {
    this.trockeurUser = trockeurUser;
    this.trockeurUserFormService.resetForm(this.editForm, trockeurUser);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, trockeurUser.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.trockeurUser?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
